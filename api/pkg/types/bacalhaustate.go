package types

import (
	"fmt"
	"strings"
)

//go:generate stringer -type=BacalhauState -trimprefix=BacalhauState
type BacalhauState int

const (
	// created just means "we have not triggered the bacalhau job yet"
	BacalhauStateCreated BacalhauState = iota
	BacalhauStateRunning
	BacalhauStateComplete
	BacalhauStateError
)

func ParseBacalhauState(str string) (BacalhauState, error) {
	for typ := BacalhauStateCreated; typ <= BacalhauStateError; typ++ {
		if strings.EqualFold(typ.String(), str) {
			return typ, nil
		}
	}

	return BacalhauStateError, fmt.Errorf(
		"executor: unknown bacalhau state '%s'", str)
}

func (e BacalhauState) MarshalText() ([]byte, error) {
	return []byte(e.String()), nil
}

func (e *BacalhauState) UnmarshalText(text []byte) (err error) {
	name := string(text)
	*e, err = ParseBacalhauState(name)
	return
}
