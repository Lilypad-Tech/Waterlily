package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/bacalhau-project/bacalhau/pkg/system"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type ServerOptions struct {
	Host            string
	Port            int
	FilestoreSecret string
}

type WaterlilyAPIServer struct {
	Options ServerOptions
}

func NewServer(
	options ServerOptions,
) (*WaterlilyAPIServer, error) {
	if options.Host == "" {
		return nil, fmt.Errorf("host is required")
	}
	if options.Port == 0 {
		return nil, fmt.Errorf("port is required")
	}
	if options.FilestoreSecret == "" {
		return nil, fmt.Errorf("filestore secret is required")
	}
	return &WaterlilyAPIServer{
		Options: options,
	}, nil
}

func (apiServer *WaterlilyAPIServer) ListenAndServe(ctx context.Context, cm *system.CleanupManager) error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()
	subrouter.HandleFunc("/artists", apiServer.artists).Methods("GET")

	srv := &http.Server{
		Addr:              fmt.Sprintf("%s:%d", apiServer.Options.Host, apiServer.Options.Port),
		WriteTimeout:      time.Minute * 15,
		ReadTimeout:       time.Minute * 15,
		ReadHeaderTimeout: time.Minute * 15,
		IdleTimeout:       time.Minute * 60,
		Handler:           router,
	}
	return srv.ListenAndServe()
}

func (apiServer *WaterlilyAPIServer) artists(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Access-Control-Allow-Origin", "*")
	var err error
	data := []interface{}{}
	err = json.NewEncoder(res).Encode(data)
	if err != nil {
		log.Ctx(req.Context()).Error().Msgf("error for job totals route: %s", err.Error())
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
}
