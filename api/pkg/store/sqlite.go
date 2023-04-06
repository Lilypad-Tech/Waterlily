package store

import (
	"context"
	"fmt"

	"embed"

	"database/sql"

	sync "github.com/bacalhau-project/golang-mutex-tracer"
	"github.com/bacalhau-project/waterlily/api/pkg/types"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

type SQLiteStore struct {
	mtx      sync.RWMutex
	filepath string
	db       *sql.DB
}

func NewSQLiteStore(
	filepath string,
	autoMigrate bool,
) (*SQLiteStore, error) {
	db, err := sql.Open("sqlite", filepath)
	if err != nil {
		return nil, err
	}
	store := &SQLiteStore{
		filepath: filepath,
		db:       db,
	}
	if autoMigrate {
		err = store.MigrateUp()
		if err != nil {
			return nil, fmt.Errorf("there was an error doing the migration: %s", err.Error())
		}
	}
	return store, nil
}

func (d *SQLiteStore) ListArtists(ctx context.Context, query ListArtistsQuery) ([]types.Artist, error) {
	return []types.Artist{}, nil
}

func (d *SQLiteStore) GetArtist(ctx context.Context, id int) (types.Artist, error) {
	return types.Artist{}, nil
}

func (d *SQLiteStore) AddArtist(ctx context.Context, data types.Artist) error {
	return nil
}

func (d *SQLiteStore) UpdateArtist(ctx context.Context, id int, data types.Artist) error {
	return nil
}

func (d *SQLiteStore) DeleteArtist(ctx context.Context, id int) error {
	return nil
}

func (d *SQLiteStore) ListImages(ctx context.Context, query ListImagesQuery) ([]types.Image, error) {
	return []types.Image{}, nil
}

func (d *SQLiteStore) GetImage(ctx context.Context, id int) (types.Image, error) {
	return types.Image{}, nil
}

func (d *SQLiteStore) AddImage(ctx context.Context, data types.Image) error {
	return nil
}

func (d *SQLiteStore) UpdateImage(ctx context.Context, id int, data types.Image) error {
	return nil
}

func (d *SQLiteStore) DeleteImage(ctx context.Context, id int) error {
	return nil
}

func (d *SQLiteStore) ListArtistImages(ctx context.Context, query ListArtistImagesQuery) ([]types.ArtistImage, error) {
	return []types.ArtistImage{}, nil
}

func (d *SQLiteStore) GetArtistImage(ctx context.Context, id int) (types.ArtistImage, error) {
	return types.ArtistImage{}, nil
}

func (d *SQLiteStore) AddArtistImage(ctx context.Context, data types.ArtistImage) error {
	return nil
}

func (d *SQLiteStore) UpdateArtistImage(ctx context.Context, id int, data types.ArtistImage) error {
	return nil
}

func (d *SQLiteStore) DeleteArtistImage(ctx context.Context, id int) error {
	return nil
}

//go:embed migrations/*.sql
var fs embed.FS

func (d *SQLiteStore) GetMigrations() (*migrate.Migrate, error) {
	files, err := iofs.New(fs, "migrations")
	if err != nil {
		return nil, err
	}
	migrations, err := migrate.NewWithSourceInstance(
		"iofs",
		files,
		fmt.Sprintf("sqlite://%s", d.filepath),
	)
	if err != nil {
		return nil, err
	}
	return migrations, nil
}

func (d *SQLiteStore) MigrateUp() error {
	migrations, err := d.GetMigrations()
	if err != nil {
		return err
	}
	err = migrations.Up()
	if err != migrate.ErrNoChange {
		return err
	}
	return nil
}

func (d *SQLiteStore) MigrateDown() error {
	migrations, err := d.GetMigrations()
	if err != nil {
		return err
	}
	err = migrations.Down()
	if err != migrate.ErrNoChange {
		return err
	}
	return nil
}
