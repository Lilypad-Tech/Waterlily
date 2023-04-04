package waterlily

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/bacalhau-project/bacalhau/dashboard/api/pkg/model"
	"github.com/spf13/cobra"
)

func getCommandLineExecutable() string {
	return os.Args[0]
}

func getDefaultServeOptionString(envName string, defaultValue string) string {
	envValue := os.Getenv(fmt.Sprintf("WATERLILY_%s", envName))
	if envValue != "" {
		return envValue
	}
	return defaultValue
}

func getDefaultServeOptionInt(envName string, defaultValue int) int {
	envValue := os.Getenv(fmt.Sprintf("WATERLILY_%s", envName))
	if envValue != "" {
		i, err := strconv.Atoi(envValue)
		if err == nil {
			return i
		}
	}
	return defaultValue
}

func FatalErrorHandler(cmd *cobra.Command, msg string, code int) {
	if len(msg) > 0 {
		// add newline if needed
		if !strings.HasSuffix(msg, "\n") {
			msg += "\n"
		}
		cmd.Print(msg)
	}
	os.Exit(code)
}

func newModelOptions() model.ModelOptions {
	return model.ModelOptions{
		PostgresHost: getDefaultServeOptionString("POSTGRES_HOST", "127.0.0.1"),
		//nolint:gomnd
		PostgresPort:     getDefaultServeOptionInt("POSTGRES_PORT", 5432),
		PostgresDatabase: getDefaultServeOptionString("POSTGRES_DATABASE", "bacalhau"),
		PostgresUser:     getDefaultServeOptionString("POSTGRES_USER", ""),
		PostgresPassword: getDefaultServeOptionString("POSTGRES_PASSWORD", ""),
	}
}

func setupModelOptions(cmd *cobra.Command, opts *model.ModelOptions) {
	cmd.PersistentFlags().StringVar(
		&opts.PostgresHost, "postgres-host", opts.PostgresHost,
		`The host for the postgres server.`,
	)
	cmd.PersistentFlags().IntVar(
		&opts.PostgresPort, "postgres-port", opts.PostgresPort,
		`The port for the postgres server.`,
	)
	cmd.PersistentFlags().StringVar(
		&opts.PostgresDatabase, "postgres-database", opts.PostgresDatabase,
		`The database for the postgres server.`,
	)
	cmd.PersistentFlags().StringVar(
		&opts.PostgresUser, "postgres-user", opts.PostgresUser,
		`The user for the postgres server.`,
	)
	cmd.PersistentFlags().StringVar(
		&opts.PostgresPassword, "postgres-password", opts.PostgresPassword,
		`The password for the postgres server.`,
	)
}
