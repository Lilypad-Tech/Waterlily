package controller

import (
	"github.com/bacalhau-project/waterlily/api/pkg/bacalhau"
	"github.com/bacalhau-project/waterlily/api/pkg/contract"
	"github.com/bacalhau-project/waterlily/api/pkg/store"
)

type ControllerOptions struct {
	Bacalhau bacalhau.Bacalhau
	Contract contract.Contract
	Store    store.Store
}

type Controller struct {
	Bacalhau bacalhau.Bacalhau
	Contract contract.Contract
	Store    store.Store
}

func NewController(
	options ControllerOptions,
) (*Controller, error) {
	controller := &Controller{
		Bacalhau: options.Bacalhau,
		Contract: options.Contract,
		Store:    options.Store,
	}
	return controller, nil
}

func (c *Controller) Start() error {
	return nil
}
