// Code generated by "stringer -type=BacalhauState -trimprefix=BacalhauState"; DO NOT EDIT.

package types

import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[BacalhauStateCreated-0]
	_ = x[BacalhauStateRunning-1]
	_ = x[BacalhauStateComplete-2]
	_ = x[BacalhauStateError-3]
}

const _BacalhauState_name = "CreatedRunningCompleteError"

var _BacalhauState_index = [...]uint8{0, 7, 14, 22, 27}

func (i BacalhauState) String() string {
	if i < 0 || i >= BacalhauState(len(_BacalhauState_index)-1) {
		return "BacalhauState(" + strconv.FormatInt(int64(i), 10) + ")"
	}
	return _BacalhauState_name[_BacalhauState_index[i]:_BacalhauState_index[i+1]]
}
