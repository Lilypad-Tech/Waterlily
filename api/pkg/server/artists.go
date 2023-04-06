package server

import (
	"encoding/json"
	"net/http"

	"github.com/bacalhau-project/waterlily/api/pkg/store"
)

func (apiServer *WaterlilyAPIServer) artists(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Access-Control-Allow-Origin", "*")
	data, err := apiServer.Controller.Store.ListArtists(req.Context(), store.ListArtistsQuery{})
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	err = json.NewEncoder(res).Encode(data)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
}
