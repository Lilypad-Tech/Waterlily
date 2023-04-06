package server

import (
	"encoding/json"
	"net/http"

	"github.com/bacalhau-project/waterlily/api/pkg/store"
)

func (apiServer *WaterlilyAPIServer) prependURL(path string) string {
	return apiServer.Options.AppURL + "/api/v1/" + path
}

func (apiServer *WaterlilyAPIServer) prependURLs(paths []string) []string {
	ret := []string{}
	for _, path := range paths {
		ret = append(ret, apiServer.prependURL(path))
	}
	return ret
}

func (apiServer *WaterlilyAPIServer) artists(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Access-Control-Allow-Origin", "*")
	data, err := apiServer.Controller.Store.ListArtists(req.Context(), store.ListArtistsQuery{})
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	for _, artist := range data {
		artist.Data.Thumbnails = apiServer.prependURLs(artist.Data.Thumbnails)
		artist.Data.Avatar = apiServer.prependURL(artist.Data.Avatar)
	}
	err = json.NewEncoder(res).Encode(data)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
}
