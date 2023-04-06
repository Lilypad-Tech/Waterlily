package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/bacalhau-project/waterlily/api/pkg/types"
	"github.com/davecgh/go-spew/spew"
	"github.com/rs/zerolog/log"
)

func (apiServer *WaterlilyAPIServer) register(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Access-Control-Allow-Origin", "*")

	err := func() error {
		// Parse the multipart form request
		err := req.ParseMultipartForm(200 << 20) // 200MB is the maximum memory allocated to store the files
		if err != nil {
			return err
		}

		artistid := req.FormValue("artistid")
		artistSubpath := fmt.Sprintf("artists/%s", artistid)
		uploadPath, err := apiServer.ensureFilestorePath(artistSubpath)
		if err != nil {
			return err
		}
		_, err = apiServer.ensureFilestorePath(fmt.Sprintf("%s/images", artistSubpath))
		if err != nil {
			return err
		}
		_, err = apiServer.ensureFilestorePath(fmt.Sprintf("%s/thumbnails", artistSubpath))
		if err != nil {
			return err
		}
		log.Ctx(req.Context()).Info().Msgf("artistid: %s, uploadPath: %s", artistid, uploadPath)
		log.Ctx(req.Context()).Info().Msgf(req.FormValue("originalArt"))
		log.Ctx(req.Context()).Info().Msgf(req.FormValue("trainingConsent"))
		log.Ctx(req.Context()).Info().Msgf(req.FormValue("legalContent"))

		originalArt, err := strconv.ParseBool(req.FormValue("originalArt"))
		if err != nil {
			return fmt.Errorf("We could not parse the originalArt field: %s", err.Error())
		}
		trainingConsent, err := strconv.ParseBool(req.FormValue("trainingConsent"))
		if err != nil {
			return fmt.Errorf("We could not parse the trainingConsent field: %s", err.Error())
		}
		legalContent, err := strconv.ParseBool(req.FormValue("legalContent"))
		if err != nil {
			return fmt.Errorf("We could not parse the legalContent field: %s", err.Error())
		}

		artistData := types.ArtistData{
			Period:          req.FormValue("period"),
			Name:            req.FormValue("name"),
			Email:           req.FormValue("email"),
			WalletAddress:   req.FormValue("walletAddress"),
			Nationality:     req.FormValue("nationality"),
			Biography:       req.FormValue("biography"),
			Category:        req.FormValue("category"),
			Style:           req.FormValue("style"),
			Portfolio:       req.FormValue("portfolio"),
			OriginalArt:     originalArt,
			TrainingConsent: trainingConsent,
			LegalContent:    legalContent,
			ArtistType:      req.FormValue("artistType"),
		}

		spew.Dump(artistData)
		return nil
	}()

	if err != nil {
		log.Ctx(req.Context()).Error().Msgf("error for register route: %s", err.Error())
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	data := []interface{}{}
	err = json.NewEncoder(res).Encode(data)
	if err != nil {
		log.Ctx(req.Context()).Error().Msgf("error for register route: %s", err.Error())
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
}
