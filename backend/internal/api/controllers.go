package api

import (
	"context"
	"crypto/rand"
	"dichterdev/spotify/internal/config"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/grokify/go-pkce"
	"golang.org/x/oauth2"
)

var (
	env     *config.Config
	spotify *oauth2.Config

	verifiers = sync.Map{}
	tokens    = sync.Map{}
)

func init() {
	env = config.LoadConfig()
	spotify = &oauth2.Config{
		ClientID: env.SpotifyClientID,
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://accounts.spotify.com/authorize",
			TokenURL: "https://accounts.spotify.com/api/token",
		},
		RedirectURL: env.BackendURL + env.CallbackPath,
		Scopes:      strings.Split(env.SpotifyScopes, " "),
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	verifier, err := pkce.NewCodeVerifier(64)
	if err != nil {
		log.Printf("Failed to generate verifier %v", err)
		http.Error(w, "Failed to generate verifier", http.StatusInternalServerError)
	}

	challenge := pkce.CodeChallengeS256(verifier)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)

	verifiers.Store(state, verifier)

	url := spotify.AuthCodeURL(
		state,
		oauth2.SetAuthURLParam(pkce.ParamCodeChallenge, challenge),
		oauth2.SetAuthURLParam(pkce.ParamCodeChallengeMethod, pkce.MethodS256),
		oauth2.AccessTypeOffline,
	)

	log.Printf("Verifier: %s", verifier)

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func handleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	if code == "" {
		http.Error(w, "Authorization code missing", http.StatusBadRequest)
		return
	}
	if state == "" {
		http.Error(w, "State parameter missing", http.StatusBadRequest)
		return
	}

	verifier, ok := verifiers.Load(state)
	if !ok {
		log.Printf("Code verifier not found for state: %s. Session might have expired or tampered.", state)
		http.Error(w, "Session expired or invalid state. Please restart authentication.", http.StatusBadRequest)
		return
	}

	token, err := spotify.Exchange(
		context.Background(),
		code,
		oauth2.SetAuthURLParam(pkce.ParamCodeVerifier, verifier.(string)),
	)

	if err != nil {
		log.Printf("Token exchange failed: %v\nVerifier: %s", err, verifier.(string))
		http.Error(w, "Token exchange failed.", http.StatusBadRequest)
		return
	}

	tokens.Store(state, token.AccessToken)

	// remove token after 1 minute
	go func() {
		time.Sleep(1 * time.Minute)
		tokens.Delete(state)
	}()

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    token.RefreshToken,
		Path:     "/",
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HttpOnly: true,
		Secure:   false, // SET TO TRUE IN PROD
		SameSite: http.SameSiteLaxMode,
	})

	url := fmt.Sprintf("%s?authSuccess=true&state=%s", env.FrontendURL, state)
	http.Redirect(w, r, url, http.StatusFound)
}

/*
Response:

	{
		access_token: string
		expires_in: number
	}
*/
func handleRefresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		if err == http.ErrNoCookie {
			http.Error(w, "No refresh token cookie found", http.StatusUnauthorized)
			return
		}
		log.Printf("Error getting refresh token cookie: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	refresh := &oauth2.Token{RefreshToken: cookie.Value}

	token, err := spotify.TokenSource(context.Background(), refresh).Token()
	if err != nil {
		log.Printf("Error sending request to Spotify refresh endpoint: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if token.RefreshToken != "" && token.RefreshToken != refresh.RefreshToken {
		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    refresh.RefreshToken,
			Path:     "/",
			Expires:  time.Now().Add(30 * 24 * time.Hour),
			HttpOnly: true,
			Secure:   false, // TRUE IN PROD
			SameSite: http.SameSiteLaxMode,
		})
	}

	response := map[string]string{
		"access_token": token.AccessToken,
		"expires_in":   fmt.Sprintf("%d", int(time.Until(token.Expiry).Seconds())),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

/*
Response:

	{
		access_token: string
	}
*/
func HandleCurrentAccessToken(w http.ResponseWriter, r *http.Request) {
	state := r.URL.Query().Get("state")
	if state == "" {
		http.Error(w, "State parameter missing", http.StatusBadRequest)
		return
	}

	token, ok := tokens.Load(state)
	if !ok {
		http.Error(w, "Access token not found or session expired. Please re-authenticate.", http.StatusNotFound)
		return
	}

	tokens.Delete(state)

	response := map[string]string{"access_token": token.(string)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
