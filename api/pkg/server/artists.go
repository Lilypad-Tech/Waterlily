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
	for _, artist := range data {
		artist.Data.Thumbnails = apiServer.Controller.PrependURLs(artist.Data.Thumbnails)
		artist.Data.Avatar = apiServer.Controller.PrependURL(artist.Data.Avatar)
	}
	err = json.NewEncoder(res).Encode(data)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
}
