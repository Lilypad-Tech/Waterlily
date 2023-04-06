package store

import (
	"context"

	"github.com/bacalhau-project/waterlily/api/pkg/types"
)

type ListArtistsQuery struct {
	OnlyNew      bool
	OnlyRunning  bool
	OnlyFinished bool
}

type ListImagesQuery struct {
	OnlyNew      bool
	OnlyRunning  bool
	OnlyFinished bool
}

type Store interface {
	ListArtists(ctx context.Context, query ListArtistsQuery) ([]*types.Artist, error)
	GetArtist(ctx context.Context, id string) (*types.Artist, error)
	AddArtist(ctx context.Context, data types.Artist) error
	UpdateArtist(ctx context.Context, data types.Artist) error
	DeleteArtist(ctx context.Context, id string) error
	ListImages(ctx context.Context, query ListImagesQuery) ([]*types.Image, error)
	GetImage(ctx context.Context, id int) (*types.Image, error)
	AddImage(ctx context.Context, data types.Image) error
	UpdateImage(ctx context.Context, data types.Image) error
}

type StoreOptions struct {
	DataFile string
}
