package bacalhau

import (
	"fmt"
	"strings"

	"github.com/bacalhau-project/bacalhau/pkg/model"
)

const (
	TrainingImage  = "algoveraai/plprojectv11:dbfinetune"
	InferenceImage = "algoveraai/plprojectv3:dbinference"
	// TODO: change this to main once we've merged
	DownloadEntrypointBranch = "phase2"
)

var baseSpec = model.Spec{
	Engine:    model.EngineDocker,
	Verifier:  model.VerifierNoop,
	Publisher: model.PublisherIpfs,
	Docker:    model.JobSpecDocker{},
	// 6 hours should be long enough to train a model
	Timeout: 3600 * 6,
	Resources: model.ResourceUsageConfig{
		GPU: "1",
	},
	Outputs: []model.StorageSpec{
		{
			Name: "outputs",
			Path: "/outputs",
		},
	},
	Deal: model.Deal{
		Concurrency: 1,
	},
	Network: model.NetworkConfig{
		Type: model.NetworkFull,
	},
}

func getTrainingEntrypoint() []string {
	fullCommand := fmt.Sprintf(`
	apt update && apt install -y curl &&
	curl -L -o /app/entrypoint.sh https://raw.githubusercontent.com/bacalhau-project/WaterLily/%s/scripts/training_entrypoint.sh &&
	bash /app/entrypoint.sh
	`, DownloadEntrypointBranch)
	singleLineCommand := strings.ReplaceAll(fullCommand, "\n", " ")
	return []string{"bash", "-c", singleLineCommand}
}

func getTrainingEnv(
	options TrainingSpecOptions,
) []string {
	return []string{
		fmt.Sprintf("ARTIST_ID=%s", options.ArtistID),
		fmt.Sprintf("IMAGES_DOWNLOAD_URL=%s", options.ImagesDownloadURL),
		fmt.Sprintf("WEIGHTS_UPLOAD_URL=%s", options.WeightsUploadURL),
	}
}

func GetTrainingSpec(
	options TrainingSpecOptions,
) model.Spec {
	ret := baseSpec
	ret.Docker = model.JobSpecDocker{
		Image:                TrainingImage,
		Entrypoint:           getTrainingEntrypoint(),
		EnvironmentVariables: getTrainingEnv(options),
	}
	return ret
}

func getInferenceEntrypoint() []string {
	fullCommand := fmt.Sprintf(`
	apt update && apt install -y curl &&
	curl -L -o /app/entrypoint.sh https://raw.githubusercontent.com/bacalhau-project/WaterLily/%s/scripts/inference_entrypoint.sh &&
	bash /app/entrypoint.sh
	`, DownloadEntrypointBranch)
	singleLineCommand := strings.ReplaceAll(fullCommand, "\n", " ")
	return []string{"bash", "-c", singleLineCommand}
}

func getInferenceEnv(
	options InferenceSpecOptions,
) []string {
	return []string{
		fmt.Sprintf("ARTIST_ID=%s", options.ArtistID),
		fmt.Sprintf("IMAGE_ID=%d", options.ImageID),
		fmt.Sprintf("PROMPT=%s", strings.ReplaceAll(options.Prompt, "\"", "\\\"")),
		fmt.Sprintf("WEIGHTS_DOWNLOAD_URL=%s", options.WeightsDownloadURL),
		fmt.Sprintf("IMAGES_UPLOAD_URL=%s", options.ImagesUploadURL),
	}
}

func GetInferenceSpec(
	options InferenceSpecOptions,
) model.Spec {
	ret := baseSpec
	ret.Docker = model.JobSpecDocker{
		Image:                InferenceImage,
		Entrypoint:           getInferenceEntrypoint(),
		EnvironmentVariables: getInferenceEnv(options),
	}
	return ret
}
