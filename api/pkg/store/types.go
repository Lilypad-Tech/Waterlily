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
	UpdateArtist(ctx context.Context, id int, data types.Artist) error
	DeleteArtist(ctx context.Context, id int) error
	ListImages(ctx context.Context, query ListImagesQuery) ([]types.Image, error)
	GetImage(ctx context.Context, id int) (types.Image, error)
	AddImage(ctx context.Context, data types.Image) error
	UpdateImage(ctx context.Context, id int, data types.Image) error
	DeleteImage(ctx context.Context, id int) error
	ListArtistImages(ctx context.Context, query ListArtistImagesQuery) ([]types.ArtistImage, error)
	GetArtistImage(ctx context.Context, id int) (types.ArtistImage, error)
	AddArtistImage(ctx context.Context, data types.ArtistImage) error
	UpdateArtistImage(ctx context.Context, id int, data types.ArtistImage) error
	DeleteArtistImage(ctx context.Context, id int) error
}
