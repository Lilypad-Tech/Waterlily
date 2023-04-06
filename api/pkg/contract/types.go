package contract

import (
	"context"
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

	GetImageIDs(
		ctx context.Context,
	) ([]int, error)

	GetArtistIDs(
		ctx context.Context,
	) ([]string, error)
}
