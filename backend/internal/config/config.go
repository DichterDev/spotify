package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	SpotifyClientID string
	SpotifyScopes   string
	FrontendURL     string
	BackendURL      string
	CallbackPath    string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, assuming environment variables are set.")
	}

	return &Config{
		SpotifyClientID: os.Getenv("SPOTIFY_CLIENT_ID"),
		SpotifyScopes:   os.Getenv("SPOTIFY_SCOPES"),
		CallbackPath:    os.Getenv("SPOTIFY_CALLBACK_PATH"),
		FrontendURL:     os.Getenv("FRONTEND_URL"),
		BackendURL:      os.Getenv("BACKEND_URL"),
	}
}
