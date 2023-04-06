package controller

import (
	"fmt"
	"time"
)

func containsString(slice []string, target string) bool {
	for _, value := range slice {
		if value == target {
			return true
		}
	}
	return false
}

func isOlderThan24Hours(t time.Time) bool {
	compareTime := time.Now().Add(-24 * time.Hour)
	return t.Before(compareTime)
}

func (c *Controller) UploadURL(path string) string {
	return c.AppURL + fmt.Sprintf("/api/v1/files?access_token=%s&path=%s", c.FilestoreToken, path)
}

func (c *Controller) DownloadURL(path string) string {
	return c.AppURL + fmt.Sprintf("/api/v1/files/%s", path)
}

func (c *Controller) PrependURL(path string) string {
	return c.AppURL + "/api/v1/" + path
}

func (c *Controller) PrependURLs(paths []string) []string {
	ret := []string{}
	for _, path := range paths {
		ret = append(ret, c.PrependURL(path))
	}
	return ret
}

func getArtistFolderPath(artistid string) string {
	return fmt.Sprintf("artists/%s", artistid)
}

func getArtistTrainingImagesPath(artistid string) string {
	return fmt.Sprintf("%s/images.tar.gz", getArtistFolderPath(artistid))
}

func getArtistWeightsPath(artistid string) string {
	return fmt.Sprintf("%s/weights.tar.gz", getArtistFolderPath(artistid))
}

func (c *Controller) getArtistTrainingImagesDownloadURL(artistid string) string {
	return c.DownloadURL(getArtistTrainingImagesPath(artistid))
}

func (c *Controller) getArtistWeightsDownloadURL(artistid string) string {
	return c.DownloadURL(getArtistWeightsPath(artistid))
}

func (c *Controller) getArtistWeightUploadURL(artistid string) string {
	return c.UploadURL(getArtistWeightsPath(artistid))
}
