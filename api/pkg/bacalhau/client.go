package bacalhau

import (
	"context"
	"fmt"

	"github.com/bacalhau-project/bacalhau/pkg/model"
	"github.com/bacalhau-project/bacalhau/pkg/requester/publicapi"
	"github.com/bacalhau-project/bacalhau/pkg/system"
	"github.com/bacalhau-project/waterlily/api/pkg/types"
	"github.com/pkg/errors"
)

type BacalhauOptions struct {
	Host string
	Port int
}

type BacalhauClient struct {
	Options BacalhauOptions
	Client  *publicapi.RequesterAPIClient
}

func init() {
	err := system.InitConfig()
	if err != nil {
		panic(err)
	}
}

func NewBacalhauClient(
	options BacalhauOptions,
) (*BacalhauClient, error) {
	if options.Host == "" {
		return nil, fmt.Errorf("host option must be set")
	}
	if options.Port <= 0 {
		return nil, fmt.Errorf("port option must be set")
	}
	client := publicapi.NewRequesterAPIClient(options.Host, uint16(options.Port))
	return &BacalhauClient{
		Options: options,
		Client:  client,
	}, nil
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
			errorMessage := ""
			// let's check to see if the execution was successful
			for _, execution := range job.State.Executions {
				if execution.State == model.ExecutionStateCompleted {
					if execution.RunOutput.ExitCode != 0 {
						errorMessage = execution.RunOutput.STDERR
						if errorMessage == "" {
							errorMessage = fmt.Sprintf("non zero exit code %d", execution.RunOutput.ExitCode)
						}
					}
				}
			}
			if errorMessage != "" {
				return types.BacalhauStateError, fmt.Errorf(errorMessage)
			}
			return types.BacalhauStateComplete, nil
		} else {
			return types.BacalhauStateError, fmt.Errorf("terminal state: %s", job.State.State.String())
		}
	}
	return types.BacalhauStateRunning, nil
}
