package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

type SpotifyAuthRes struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

var (
	client           string
	spotifyRedirect  string
	frontendRedirect string

	verifiers = sync.Map{}
	tokens    = sync.Map{}
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	client = os.Getenv("SPOTIFY_CLIENT_ID")
	spotifyRedirect = os.Getenv("SPOTIFY_REDIRECT_URL")
	frontendRedirect = os.Getenv("FRONTEND_REDIRECT_URL")
}

func HandleSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		CodeVerifier string `json:"code_verifier"`
		State        string `json:"state"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if body.CodeVerifier == "" || body.State == "" {
		http.Error(w, "Code verifier or state missing", http.StatusBadRequest)
		return
	}

	verifiers.Store(body.State, body.CodeVerifier)
	w.WriteHeader(http.StatusOK)
}

func HandleCallback(w http.ResponseWriter, r *http.Request) {
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

	codeVerifier := verifier.(string)
	verifiers.Delete(state)

	data := url.Values{}
	data.Set("client_id", client)
	data.Set("code", code)
	data.Set("redirect_uri", spotifyRedirect)
	data.Set("code_verifier", codeVerifier)
	data.Set("grant_type", "authorization_code")

	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", bytes.NewBufferString(data.Encode()))
	if err != nil {
		log.Printf("Error creating Spotify token request: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to Spotify token endpoint: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("Spotify token exchange failed. Status: %d, Body: %s", resp.StatusCode, string(bodyBytes))
		http.Error(w, string(bodyBytes), resp.StatusCode)
		return
	}

	var authResponse SpotifyAuthRes
	if err := json.NewDecoder(resp.Body).Decode(&authResponse); err != nil {
		log.Printf("Error decoding Spotify token response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    authResponse.RefreshToken,
		Path:     "/",
		Expires:  time.Now().Add(30 * 24 * time.Hour), // 30 days expiry
		HttpOnly: true,                                // Crucial for security
		Secure:   false,                               // Crucial for production (HTTPS only)
		SameSite: http.SameSiteLaxMode,                // Helps mitigate CSRF
	})

	tokens.Store(state, authResponse.AccessToken)

	go func() {
		time.Sleep(1 * time.Minute)
		tokens.Delete(state)
	}()

	url := fmt.Sprintf("%s?authSuccess=true&state=%s", frontendRedirect, state)
	http.Redirect(w, r, url, http.StatusFound)
}

func HandleRefresh(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

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

	refresh := cookie.Value

	data := url.Values{}
	data.Set("grant_type", "refresh_token")
	data.Set("refresh_token", refresh)
	data.Set("client_id", client)

	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", bytes.NewBufferString(data.Encode()))
	if err != nil {
		log.Printf("Error creating Spotify refresh request: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request to Spotify refresh endpoint: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("Spotify token refresh failed. Status: %d, Body: %s", resp.StatusCode, string(bodyBytes))
		http.Error(w, fmt.Sprintf("Failed to refresh tokens from Spotify: %s", string(bodyBytes)), resp.StatusCode)
		return
	}

	var authResponse SpotifyAuthRes
	if err := json.NewDecoder(resp.Body).Decode(&authResponse); err != nil {
		log.Printf("Error decoding Spotify refresh response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if authResponse.RefreshToken != "" && authResponse.RefreshToken != refresh {
		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    authResponse.RefreshToken,
			Path:     "/",
			Expires:  time.Now().Add(30 * 24 * time.Hour),
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"access_token": authResponse.AccessToken,
		"expires_in":   authResponse.ExpiresIn,
	})
}

func HandleCurrentAccessToken(w http.ResponseWriter, r *http.Request) {
	state := r.URL.Query().Get("state")
	if state == "" {
		http.Error(w, "State parameter missing", http.StatusBadRequest)
		return
	}

	accessTokenVal, ok := tokens.Load(state)
	if !ok {
		http.Error(w, "Access token not found or session expired. Please re-authenticate.", http.StatusNotFound)
		return
	}
	accessToken := accessTokenVal.(string)
	tokens.Delete(state)

	response := map[string]string{"access_token": accessToken}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
