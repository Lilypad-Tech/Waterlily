package store

import (
	"context"
	"encoding/json"
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

type SQLScanner interface {
	Scan(dest ...any) error
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

	_, err = db.Exec(`PRAGMA foreign_keys = ON`)
	if err != nil {
		return nil, err
	}

	return store, nil
}

func scanArtist(scanner SQLScanner) (*types.Artist, error) {
	var bacalhauStateString string
	var contractStateString string
	var artistDataString string
	artist := &types.Artist{}
	err := scanner.Scan(artist.ID, artist.Created, artist.BacalhauTrainingID, &bacalhauStateString, &contractStateString, &artistDataString)
	if err != nil {
		return nil, err
	}
	bacalhauState, err := types.ParseBacalhauState(bacalhauStateString)
	if err != nil {
		return nil, err
	}
	contractState, err := types.ParseContractState(contractStateString)
	if err != nil {
		return nil, err
	}

	artist.BacalhauState = bacalhauState
	artist.ContractState = contractState

	var artistData types.ArtistData
	err = json.Unmarshal([]byte(artistDataString), &artistData)
	if err != nil {
		return nil, err
	}

	artist.Data = artistData

	return artist, nil
}

func scanImage(scanner SQLScanner) (*types.Image, error) {
	var bacalhauStateString string
	var contractStateString string
	image := &types.Image{}
	err := scanner.Scan(image.ID, image.Created, image.BacalhauInferenceID, &bacalhauStateString, &contractStateString, &image.Artist, &image.Prompt)
	if err != nil {
		return nil, err
	}
	bacalhauState, err := types.ParseBacalhauState(bacalhauStateString)
	if err != nil {
		return nil, err
	}
	contractState, err := types.ParseContractState(contractStateString)
	if err != nil {
		return nil, err
	}

	image.BacalhauState = bacalhauState
	image.ContractState = contractState

	return image, nil
}

func (d *SQLiteStore) ListArtists(ctx context.Context, query ListArtistsQuery) ([]*types.Artist, error) {
	d.mtx.RLock()
	defer d.mtx.RUnlock()
	sqlStatement := `
select
	id, created, bacalhau_training_id, bacalhau_state, contract_state, data
from
	artist
order by
	created desc
`

	rows, err := d.db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	entries := []*types.Artist{}
	for rows.Next() {
		artist, err := scanArtist(rows)
		if err != nil {
			return nil, err
		}
		entries = append(entries, artist)
	}
	if err = rows.Err(); err != nil {
		return entries, err
	}

	return entries, nil
}

func (d *SQLiteStore) GetArtist(ctx context.Context, id string) (*types.Artist, error) {
	d.mtx.RLock()
	defer d.mtx.RUnlock()
	row := d.db.QueryRow(`
select
	id, created, bacalhau_training_id, bacalhau_state, contract_state, data
from
	useraccount
where
	unique_code = $1
`, id)
	artist, err := scanArtist(row)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("artist not found: %s %s", id, err.Error())
		} else {
			return nil, err
		}
	}
	return artist, nil
}

func (d *SQLiteStore) AddArtist(ctx context.Context, data types.Artist) error {
	d.mtx.Lock()
	defer d.mtx.Unlock()
	jsonString, err := json.Marshal(data.Data)
	if err != nil {
		return err
	}
	sqlStatement := `
INSERT INTO artist (id, data)
VALUES ($1, $2)`
	_, err = d.db.Exec(
		sqlStatement,
		data.ID,
		jsonString,
	)
	if err != nil {
		return err
	}
	return nil
}

func (d *SQLiteStore) ListImages(ctx context.Context, query ListImagesQuery) ([]*types.Image, error) {
	d.mtx.RLock()
	defer d.mtx.RUnlock()
	sqlStatement := `
select
	id, created, bacalhau_inference_id, bacalhau_state, contract_state, artist_id, prompt
from
	image
order by
	created desc
`

	rows, err := d.db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	entries := []*types.Image{}
	for rows.Next() {
		image, err := scanImage(rows)
		if err != nil {
			return nil, err
		}
		entries = append(entries, image)
	}
	if err = rows.Err(); err != nil {
		return entries, err
	}

	return entries, nil
}

func (d *SQLiteStore) GetImage(ctx context.Context, id int) (*types.Image, error) {
	d.mtx.RLock()
	defer d.mtx.RUnlock()
	row := d.db.QueryRow(`
select
	id, created, bacalhau_inference_id, bacalhau_state, contract_state, artist_id, prompt
from
	image
where
	id = $1
`, id)
	image, err := scanImage(row)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("image not found: %d %s", id, err.Error())
		} else {
			return nil, err
		}
	}
	return image, nil
}

func (d *SQLiteStore) AddImage(ctx context.Context, data types.Image) error {
	d.mtx.Lock()
	defer d.mtx.Unlock()
	sqlStatement := `
INSERT INTO image (id, artist_id, prompt)
VALUES ($1)`
	_, err := d.db.Exec(
		sqlStatement,
		data.ID,
		data.Artist,
		data.Prompt,
	)
	if err != nil {
		return err
	}
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
