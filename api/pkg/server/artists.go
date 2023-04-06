package server

import (
	"encoding/json"
	"net/http"

	"github.com/rs/zerolog/log"
)

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
