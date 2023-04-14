package types

import (
	"fmt"
	"strings"
)

//go:generate stringer -type=ContractState -trimprefix=ContractState
type ContractState int

const (
	ContractStateNone ContractState = iota
	ContractStateComplete
	ContractStateError
)

func ParseContractState(str string) (ContractState, error) {
	for typ := ContractStateNone; typ <= ContractStateError; typ++ {
		if strings.EqualFold(typ.String(), str) {
			return typ, nil
		}
	}

	return ContractStateError, fmt.Errorf(
		"executor: unknown Contract state '%s'", str)
}

func (e ContractState) MarshalText() ([]byte, error) {
	return []byte(e.String()), nil
}

func (e *ContractState) UnmarshalText(text []byte) (err error) {
	name := string(text)
	*e, err = ParseContractState(name)
	return
}
