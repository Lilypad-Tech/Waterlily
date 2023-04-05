package server

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func (apiServer *WaterlilyAPIServer) filestoreUpload(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form request
	err := r.ParseMultipartForm(32 << 20) // 32MB is the maximum memory allocated to store the file
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// extract the access_token query parameter and compare it against the apiServer.Options.FilestoreToken
	// if they don't match, return an error
	access_token := r.URL.Query().Get("access_token")
	if access_token != apiServer.Options.FilestoreToken {
		http.Error(w, "access_token does not match", http.StatusUnauthorized)
		return
	}

	// the folder we should put this image into
	path := r.FormValue("path")
	uploadDir := filepath.Join(apiServer.Options.FilestoreDirectory, path)

	err = os.MkdirAll(uploadDir, 0755)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get the file from the "uploads" field
	file, handler, err := r.FormFile("uploads")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create the file in the save directory
	f, err := os.OpenFile(filepath.Join(uploadDir, handler.Filename), os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()

	// Write the file to the disk
	_, err = io.Copy(f, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success
	w.WriteHeader(http.StatusOK)
}
