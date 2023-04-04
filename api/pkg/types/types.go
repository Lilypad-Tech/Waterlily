package types

import "time"

type Image struct {
	ID                  int           `json:"id"`
	Created             time.Time     `json:"created"`
	ContractID          int           `json:"contract_id"`
	BacalhauInferenceID string        `json:"bacalhau_inference_id"`
	BacalhauState       BacalhauState `json:"bacalhau_state"`
	ContractState       ContractState `json:"contract_state"`
	ArtistCode          string        `json:"artist_code"`
	Prompt              string        `json:"prompt"`
}

type Artist struct {
	ID                 int           `json:"id"`
	Created            time.Time     `json:"created"`
	UniqueCode         string        `json:"unique_code"`
	BacalhauTrainingID string        `json:"bacalhau_training_id"`
	BacalhauState      BacalhauState `json:"bacalhau_state"`
	ContractState      ContractState `json:"contract_state"`
	Data               string        `json:"data"`
}

type ArtistImage struct {
	ID                  int           `json:"id"`
	Created             time.Time     `json:"created"`
	BacalhauInferenceID string        `json:"bacalhau_inference_id"`
	BacalhauState       BacalhauState `json:"bacalhau_state"`
	Prompt              string        `json:"prompt"`
}

type ImageCreatedEvent struct {
	ContractID int    `json:"id"`
	ArtistCode string `json:"artist_code"`
	Prompt     string `json:"prompt"`
}

type ArtistCreatedEvent struct {
	ArtistCode string `json:"artist_code"`
}
