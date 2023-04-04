package types

import "time"

type Image struct {
	ID                  int           `json:"id"`
	Created             time.Time     `json:"created"`
	ContractID          int           `json:"contract_id"`
	BacalhauInferenceID string        `json:"bacalhau_inference_id"`
	BacalhauState       BacalhauState `json:"bacalhau_state"`
	ContractState       ContractState `json:"contract_state"`
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
}
