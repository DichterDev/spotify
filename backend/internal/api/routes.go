package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func Start() {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)

	r.Route("/", func(r chi.Router) {
		r.Get("/verify", HandleSession)
		r.Get("/callback", HandleCallback)
		r.Get("/refresh", HandleRefresh)

	})

	http.ListenAndServe(":3000", r)
}
