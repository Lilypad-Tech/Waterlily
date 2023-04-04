package waterlily

import (
	"os"
	"os/signal"

	"github.com/bacalhau-project/bacalhau/pkg/system"
	"github.com/bacalhau-project/waterlily/api/pkg/server"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"
)

type AllOptions struct {
	ServerOptions server.ServerOptions
}

func NewAllOptions() *AllOptions {
	return &AllOptions{
		ServerOptions: server.ServerOptions{
			Host:            getDefaultServeOptionString("HOST", "0.0.0.0"),
			Port:            getDefaultServeOptionInt("PORT", 80), //nolint:gomnd
			FilestoreSecret: getDefaultServeOptionString("FILESTORE_SECRET", ""),
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
		&allOptions.ServerOptions.FilestoreSecret, "filestore-secret", allOptions.ServerOptions.FilestoreSecret,
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
