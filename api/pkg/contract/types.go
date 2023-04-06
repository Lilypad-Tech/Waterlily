package contract

import (
	"context"

	"github.com/bacalhau-project/waterlily/api/pkg/types"
)

type Contract interface {
	Complete(
		ctx context.Context,
		id int,
		result string,
	) error

	Cancel(
		ctx context.Context,
		id int,
		errorString string,
	) error

	Listen(
		ctx context.Context,
		imageChan chan<- *types.ImageCreatedEvent,
		artistChan chan<- *types.ArtistCreatedEvent,
	) error
}
