package bacalhau

import (
	"context"

	"github.com/bacalhau-project/bacalhau/pkg/model"
	"github.com/bacalhau-project/waterlily/api/pkg/types"
)

type Bacalhau interface {
	CreateJob(
		ctx context.Context,
		spec model.Spec,
		annotations []string,
	) (*model.Job, error)

	GetJobStatus(
		ctx context.Context,
		jobID string,
	) (types.BacalhauState, error)
}
