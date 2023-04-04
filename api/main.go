package main

import (
	"github.com/bacalhau-project/waterlily/api/cmd/waterlily"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	waterlily.Execute()
}
