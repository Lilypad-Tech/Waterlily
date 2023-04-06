package types

import "time"

type Image struct {
	ID                  int           `json:"id"`
	Created             time.Time     `json:"created"`
	BacalhauInferenceID string        `json:"bacalhau_inference_id"`
	BacalhauState       BacalhauState `json:"bacalhau_state"`
	ContractState       ContractState `json:"contract_state"`
	Artist              string        `json:"artist"`
	Prompt              string        `json:"prompt"`
}

type ArtistData struct {
	Period          string   `json:"period"`
	Name            string   `json:"name"`
	Email           string   `json:"email"`
	WalletAddress   string   `json:"walletAddress"`
	Nationality     string   `json:"nationality"`
	Biography       string   `json:"biography"`
	Category        string   `json:"category"`
	Style           string   `json:"style"`
	Tags            string   `json:"tags"`
	Portfolio       string   `json:"portfolio"`
	OriginalArt     bool     `json:"originalArt"`
	TrainingConsent bool     `json:"trainingConsent"`
	LegalContent    bool     `json:"legalConsent"`
	ArtistType      string   `json:"artistType"`
	Avatar          string   `json:"avatar"`
	Thumbnails      []string `json:"thumbnails"`
}

type Artist struct {
	ID                 string        `json:"id"`
	Created            time.Time     `json:"created"`
	BacalhauTrainingID string        `json:"bacalhau_training_id"`
	BacalhauState      BacalhauState `json:"bacalhau_state"`
	ContractState      ContractState `json:"contract_state"`
	Data               ArtistData    `json:"data"`
}

type ImageCreatedEvent struct {
	ContractID int    `json:"id"`
	ArtistCode string `json:"artist_code"`
	Prompt     string `json:"prompt"`
}

type ArtistCreatedEvent struct {
	ArtistCode string `json:"artist_code"`
}
