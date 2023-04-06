package store

import (
	"context"

	"github.com/bacalhau-project/waterlily/api/pkg/types"
)

type ListArtistsQuery struct {
}

type ListImagesQuery struct {
}

type ListArtistImagesQuery struct {
}

type Store interface {
	ListArtists(ctx context.Context, query ListArtistsQuery) ([]types.Artist, error)
	GetArtist(ctx context.Context, id int) (types.Artist, error)
	AddArtist(ctx context.Context, data types.Artist) error
	ListImages(ctx context.Context, query ListImagesQuery) ([]types.Image, error)
	GetImage(ctx context.Context, id int) (types.Image, error)
	AddImage(ctx context.Context, data types.Image) error
}
