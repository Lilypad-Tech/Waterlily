package bacalhau

import (
	"context"

	"github.com/bacalhau-project/bacalhau/pkg/model"
	"github.com/bacalhau-project/bacalhau/pkg/requester/publicapi"
	"github.com/bacalhau-project/bacalhau/pkg/system"
	"github.com/bacalhau-project/waterlily/api/pkg/types"
	"github.com/pkg/errors"
)

type BacalhauClient struct {
	Client *publicapi.RequesterAPIClient
}

func init() {
	err := system.InitConfig()
	if err != nil {
		panic(err)
	}
}

func NewBacalhauClient(
	apiHost string,
	apiPort int,
) *BacalhauClient {
	client := publicapi.NewRequesterAPIClient(apiHost, uint16(apiPort))
	return &BacalhauClient{
		Client: client,
	}
}

func (r *BacalhauClient) CreateJob(
	ctx context.Context,
	spec model.Spec,
	annotations []string,
) (*model.Job, error) {
	job, err := model.NewJobWithSaneProductionDefaults()
	if err != nil {
		return nil, errors.Wrap(err, "error creating Bacalhau job")
	}
	job.Spec = spec
	job.Spec.Annotations = append(job.Spec.Annotations, annotations...)
	return r.Client.Submit(ctx, job)
}

func (r *BacalhauClient) GetJobStatus(
	ctx context.Context,
	jobID string,
) (types.BacalhauState, error) {
	job, found, err := r.Client.Get(ctx, jobID)
	if err != nil {
		return types.BacalhauStateError, err
	}
	if !found {
		return types.BacalhauStateError, errors.New("job not found")
	}
	if job.State.State.IsTerminal() {
		if job.State.State == model.JobStateCompleted {
			return types.BacalhauStateComplete, nil
		} else {
			return types.BacalhauStateError, nil
		}
	}
	return types.BacalhauStateRunning, nil
}
