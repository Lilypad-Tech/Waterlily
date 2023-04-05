package waterlily

import (
	"os"
	"os/signal"

	"github.com/bacalhau-project/bacalhau/pkg/system"
	"github.com/bacalhau-project/waterlily/api/pkg/bacalhau"
	"github.com/bacalhau-project/waterlily/api/pkg/contract"
	"github.com/bacalhau-project/waterlily/api/pkg/server"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"
)

type AllOptions struct {
	ServerOptions   server.ServerOptions
	BacalhauOptions bacalhau.BacalhauOptions
	ContractOptions contract.ContractOptions
}

func NewAllOptions() *AllOptions {
	return &AllOptions{
		ServerOptions: server.ServerOptions{
			Host:           getDefaultServeOptionString("BIND_HOST", "0.0.0.0"),
			Port:           getDefaultServeOptionInt("BIND_PORT", 80), //nolint:gomnd
			FilestoreToken: getDefaultServeOptionString("FILESTORE_TOKEN", ""),
		},
		BacalhauOptions: bacalhau.BacalhauOptions{
			Host: getDefaultServeOptionString("BACALHAU_HOST", "ai-art-requester.cluster.world"),
			Port: getDefaultServeOptionInt("BACALHAU_PORT", 1234),
		},
		ContractOptions: contract.ContractOptions{
			Address:     getDefaultServeOptionString("CONTRACT_ADDRESS", ""),
			PrivateKey:  getDefaultServeOptionString("PRIVATE_KEY", ""),
			RPCEndpoint: getDefaultServeOptionString("RPC_ENDPOINT", ""),
			ChainID:     getDefaultServeOptionString("CHAIN_ID", ""),
		},
	}
}

func newServeCmd() *cobra.Command {
	allOptions := NewAllOptions()

	serveCmd := &cobra.Command{
		Use:     "serve",
		Short:   "Start the waterlily api server.",
		Long:    "Start the waterlily api server.",
		Example: "TBD",
		RunE: func(cmd *cobra.Command, _ []string) error {
			return serve(cmd, allOptions)
		},
	}

	serveCmd.PersistentFlags().StringVar(
		&allOptions.ServerOptions.Host, "host", allOptions.ServerOptions.Host,
		`The host to bind the dashboard server to.`,
	)
	serveCmd.PersistentFlags().IntVar(
		&allOptions.ServerOptions.Port, "port", allOptions.ServerOptions.Port,
		`The host to bind the dashboard server to.`,
	)
	serveCmd.PersistentFlags().StringVar(
		&allOptions.ServerOptions.FilestoreToken, "filestore-token", allOptions.ServerOptions.FilestoreToken,
		`The secret for the filestore.`,
	)

	return serveCmd
}

func serve(cmd *cobra.Command, options *AllOptions) error {
	// Cleanup manager ensures that resources are freed before exiting:
	cm := system.NewCleanupManager()
	defer cm.Cleanup(cmd.Context())
	ctx := cmd.Context()

	// Context ensures main goroutine waits until killed with ctrl+c:
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	ctx, rootSpan := system.NewRootSpan(ctx, system.GetTracer(), "waterlily/api/cmd/serve")
	defer rootSpan.End()

	server, err := server.NewServer(
		options.ServerOptions,
	)
	if err != nil {
		return err
	}

	go func() {
		err := server.ListenAndServe(ctx, cm)
		if err != nil {
			panic(err)
		}
	}()

	log.Ctx(ctx).Info().Msgf("Waterlily server listening on %s:%d", options.ServerOptions.Host, options.ServerOptions.Port)

	<-ctx.Done()
	return nil
}
