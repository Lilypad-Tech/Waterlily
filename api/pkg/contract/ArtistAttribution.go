// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contract

import (
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// ArtistAttributionArtist is an auto generated low-level Go binding around an user-defined struct.
type ArtistAttributionArtist struct {
	Id         string
	Wallet     common.Address
	Metadata   string
	Escrow     *big.Int
	Revenue    *big.Int
	NumJobsRun *big.Int
	IsTrained  bool
}

// ArtistAttributionImage is an auto generated low-level Go binding around an user-defined struct.
type ArtistAttributionImage struct {
	Id           *big.Int
	Customer     common.Address
	Artist       string
	Prompt       string
	IpfsResult   string
	ErrorMessage string
	IsComplete   bool
	IsCancelled  bool
}

// ArtistAttributionABI is the input ABI used to generate the binding from.
const ArtistAttributionABI = "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_artistCost\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_imageCost\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_artistCommission\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"wallet\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"escrow\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"revenue\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"numJobsRun\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"isTrained\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structArtistAttribution.Artist\",\"name\":\"artist\",\"type\":\"tuple\"}],\"name\":\"EventArtistCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"customer\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"artist\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"prompt\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ipfsResult\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"errorMessage\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"isComplete\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isCancelled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structArtistAttribution.Image\",\"name\":\"image\",\"type\":\"tuple\"}],\"name\":\"EventImageCancelled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"customer\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"artist\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"prompt\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ipfsResult\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"errorMessage\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"isComplete\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isCancelled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structArtistAttribution.Image\",\"name\":\"image\",\"type\":\"tuple\"}],\"name\":\"EventImageComplete\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"customer\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"artist\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"prompt\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ipfsResult\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"errorMessage\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"isComplete\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isCancelled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structArtistAttribution.Image\",\"name\":\"image\",\"type\":\"tuple\"}],\"name\":\"EventImageCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"ArtistCancelled\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"ArtistComplete\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"}],\"name\":\"CreateArtist\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_artistID\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_prompt\",\"type\":\"string\"}],\"name\":\"CreateImage\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_id\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_errorMsg\",\"type\":\"string\"}],\"name\":\"ImageCancelled\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_id\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_result\",\"type\":\"string\"}],\"name\":\"ImageComplete\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"addresspayable\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"adminWithdraw\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"newWallet\",\"type\":\"address\"}],\"name\":\"artistChangeWallet\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"artistCommission\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"artistCost\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"artistWithdraw\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"computeProviderEscrow\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"computeProviderRevenue\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"deleteArtist\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"getArtist\",\"outputs\":[{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"wallet\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"escrow\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"revenue\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"numJobsRun\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"isTrained\",\"type\":\"bool\"}],\"internalType\":\"structArtistAttribution.Artist\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getArtistCommission\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getArtistCost\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getArtistIDs\",\"outputs\":[{\"internalType\":\"string[]\",\"name\":\"\",\"type\":\"string[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"customerAddress\",\"type\":\"address\"}],\"name\":\"getCustomerImages\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"getImage\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"customer\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"artist\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"prompt\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ipfsResult\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"errorMessage\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"isComplete\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isCancelled\",\"type\":\"bool\"}],\"internalType\":\"structArtistAttribution.Image\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getImageCost\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getImageIDs\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"imageCost\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_artistCost\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_imageCost\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_artistCommission\",\"type\":\"uint256\"}],\"name\":\"updateCost\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"

// ArtistAttribution is an auto generated Go binding around an Ethereum contract.
type ArtistAttribution struct {
	ArtistAttributionCaller     // Read-only binding to the contract
	ArtistAttributionTransactor // Write-only binding to the contract
	ArtistAttributionFilterer   // Log filterer for contract events
}

// ArtistAttributionCaller is an auto generated read-only Go binding around an Ethereum contract.
type ArtistAttributionCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ArtistAttributionTransactor is an auto generated write-only Go binding around an Ethereum contract.
type ArtistAttributionTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ArtistAttributionFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type ArtistAttributionFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ArtistAttributionSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type ArtistAttributionSession struct {
	Contract     *ArtistAttribution // Generic contract binding to set the session for
	CallOpts     bind.CallOpts      // Call options to use throughout this session
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// ArtistAttributionCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type ArtistAttributionCallerSession struct {
	Contract *ArtistAttributionCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts            // Call options to use throughout this session
}

// ArtistAttributionTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type ArtistAttributionTransactorSession struct {
	Contract     *ArtistAttributionTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts            // Transaction auth options to use throughout this session
}

// ArtistAttributionRaw is an auto generated low-level Go binding around an Ethereum contract.
type ArtistAttributionRaw struct {
	Contract *ArtistAttribution // Generic contract binding to access the raw methods on
}

// ArtistAttributionCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type ArtistAttributionCallerRaw struct {
	Contract *ArtistAttributionCaller // Generic read-only contract binding to access the raw methods on
}

// ArtistAttributionTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type ArtistAttributionTransactorRaw struct {
	Contract *ArtistAttributionTransactor // Generic write-only contract binding to access the raw methods on
}

// NewArtistAttribution creates a new instance of ArtistAttribution, bound to a specific deployed contract.
func NewArtistAttribution(address common.Address, backend bind.ContractBackend) (*ArtistAttribution, error) {
	contract, err := bindArtistAttribution(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &ArtistAttribution{ArtistAttributionCaller: ArtistAttributionCaller{contract: contract}, ArtistAttributionTransactor: ArtistAttributionTransactor{contract: contract}, ArtistAttributionFilterer: ArtistAttributionFilterer{contract: contract}}, nil
}

// NewArtistAttributionCaller creates a new read-only instance of ArtistAttribution, bound to a specific deployed contract.
func NewArtistAttributionCaller(address common.Address, caller bind.ContractCaller) (*ArtistAttributionCaller, error) {
	contract, err := bindArtistAttribution(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionCaller{contract: contract}, nil
}

// NewArtistAttributionTransactor creates a new write-only instance of ArtistAttribution, bound to a specific deployed contract.
func NewArtistAttributionTransactor(address common.Address, transactor bind.ContractTransactor) (*ArtistAttributionTransactor, error) {
	contract, err := bindArtistAttribution(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionTransactor{contract: contract}, nil
}

// NewArtistAttributionFilterer creates a new log filterer instance of ArtistAttribution, bound to a specific deployed contract.
func NewArtistAttributionFilterer(address common.Address, filterer bind.ContractFilterer) (*ArtistAttributionFilterer, error) {
	contract, err := bindArtistAttribution(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionFilterer{contract: contract}, nil
}

// bindArtistAttribution binds a generic wrapper to an already deployed contract.
func bindArtistAttribution(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(ArtistAttributionABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ArtistAttribution *ArtistAttributionRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _ArtistAttribution.Contract.ArtistAttributionCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ArtistAttribution *ArtistAttributionRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistAttributionTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ArtistAttribution *ArtistAttributionRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistAttributionTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ArtistAttribution *ArtistAttributionCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _ArtistAttribution.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ArtistAttribution *ArtistAttributionTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ArtistAttribution *ArtistAttributionTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.contract.Transact(opts, method, params...)
}

// ArtistCommission is a free data retrieval call binding the contract method 0x983586b1.
//
// Solidity: function artistCommission() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) ArtistCommission(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "artistCommission")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ArtistCommission is a free data retrieval call binding the contract method 0x983586b1.
//
// Solidity: function artistCommission() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) ArtistCommission() (*big.Int, error) {
	return _ArtistAttribution.Contract.ArtistCommission(&_ArtistAttribution.CallOpts)
}

// ArtistCommission is a free data retrieval call binding the contract method 0x983586b1.
//
// Solidity: function artistCommission() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) ArtistCommission() (*big.Int, error) {
	return _ArtistAttribution.Contract.ArtistCommission(&_ArtistAttribution.CallOpts)
}

// ArtistCost is a free data retrieval call binding the contract method 0x19856742.
//
// Solidity: function artistCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) ArtistCost(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "artistCost")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ArtistCost is a free data retrieval call binding the contract method 0x19856742.
//
// Solidity: function artistCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) ArtistCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.ArtistCost(&_ArtistAttribution.CallOpts)
}

// ArtistCost is a free data retrieval call binding the contract method 0x19856742.
//
// Solidity: function artistCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) ArtistCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.ArtistCost(&_ArtistAttribution.CallOpts)
}

// ComputeProviderEscrow is a free data retrieval call binding the contract method 0xfeadcdeb.
//
// Solidity: function computeProviderEscrow() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) ComputeProviderEscrow(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "computeProviderEscrow")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ComputeProviderEscrow is a free data retrieval call binding the contract method 0xfeadcdeb.
//
// Solidity: function computeProviderEscrow() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) ComputeProviderEscrow() (*big.Int, error) {
	return _ArtistAttribution.Contract.ComputeProviderEscrow(&_ArtistAttribution.CallOpts)
}

// ComputeProviderEscrow is a free data retrieval call binding the contract method 0xfeadcdeb.
//
// Solidity: function computeProviderEscrow() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) ComputeProviderEscrow() (*big.Int, error) {
	return _ArtistAttribution.Contract.ComputeProviderEscrow(&_ArtistAttribution.CallOpts)
}

// ComputeProviderRevenue is a free data retrieval call binding the contract method 0xe6b73d69.
//
// Solidity: function computeProviderRevenue() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) ComputeProviderRevenue(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "computeProviderRevenue")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ComputeProviderRevenue is a free data retrieval call binding the contract method 0xe6b73d69.
//
// Solidity: function computeProviderRevenue() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) ComputeProviderRevenue() (*big.Int, error) {
	return _ArtistAttribution.Contract.ComputeProviderRevenue(&_ArtistAttribution.CallOpts)
}

// ComputeProviderRevenue is a free data retrieval call binding the contract method 0xe6b73d69.
//
// Solidity: function computeProviderRevenue() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) ComputeProviderRevenue() (*big.Int, error) {
	return _ArtistAttribution.Contract.ComputeProviderRevenue(&_ArtistAttribution.CallOpts)
}

// GetArtist is a free data retrieval call binding the contract method 0xa2498ab3.
//
// Solidity: function getArtist(string id) view returns((string,address,string,uint256,uint256,uint256,bool))
func (_ArtistAttribution *ArtistAttributionCaller) GetArtist(opts *bind.CallOpts, id string) (ArtistAttributionArtist, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getArtist", id)

	if err != nil {
		return *new(ArtistAttributionArtist), err
	}

	out0 := *abi.ConvertType(out[0], new(ArtistAttributionArtist)).(*ArtistAttributionArtist)

	return out0, err

}

// GetArtist is a free data retrieval call binding the contract method 0xa2498ab3.
//
// Solidity: function getArtist(string id) view returns((string,address,string,uint256,uint256,uint256,bool))
func (_ArtistAttribution *ArtistAttributionSession) GetArtist(id string) (ArtistAttributionArtist, error) {
	return _ArtistAttribution.Contract.GetArtist(&_ArtistAttribution.CallOpts, id)
}

// GetArtist is a free data retrieval call binding the contract method 0xa2498ab3.
//
// Solidity: function getArtist(string id) view returns((string,address,string,uint256,uint256,uint256,bool))
func (_ArtistAttribution *ArtistAttributionCallerSession) GetArtist(id string) (ArtistAttributionArtist, error) {
	return _ArtistAttribution.Contract.GetArtist(&_ArtistAttribution.CallOpts, id)
}

// GetArtistCommission is a free data retrieval call binding the contract method 0x072792b1.
//
// Solidity: function getArtistCommission() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) GetArtistCommission(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getArtistCommission")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetArtistCommission is a free data retrieval call binding the contract method 0x072792b1.
//
// Solidity: function getArtistCommission() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) GetArtistCommission() (*big.Int, error) {
	return _ArtistAttribution.Contract.GetArtistCommission(&_ArtistAttribution.CallOpts)
}

// GetArtistCommission is a free data retrieval call binding the contract method 0x072792b1.
//
// Solidity: function getArtistCommission() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) GetArtistCommission() (*big.Int, error) {
	return _ArtistAttribution.Contract.GetArtistCommission(&_ArtistAttribution.CallOpts)
}

// GetArtistCost is a free data retrieval call binding the contract method 0x34cc25f0.
//
// Solidity: function getArtistCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) GetArtistCost(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getArtistCost")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetArtistCost is a free data retrieval call binding the contract method 0x34cc25f0.
//
// Solidity: function getArtistCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) GetArtistCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.GetArtistCost(&_ArtistAttribution.CallOpts)
}

// GetArtistCost is a free data retrieval call binding the contract method 0x34cc25f0.
//
// Solidity: function getArtistCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) GetArtistCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.GetArtistCost(&_ArtistAttribution.CallOpts)
}

// GetArtistIDs is a free data retrieval call binding the contract method 0xec32d942.
//
// Solidity: function getArtistIDs() view returns(string[])
func (_ArtistAttribution *ArtistAttributionCaller) GetArtistIDs(opts *bind.CallOpts) ([]string, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getArtistIDs")

	if err != nil {
		return *new([]string), err
	}

	out0 := *abi.ConvertType(out[0], new([]string)).(*[]string)

	return out0, err

}

// GetArtistIDs is a free data retrieval call binding the contract method 0xec32d942.
//
// Solidity: function getArtistIDs() view returns(string[])
func (_ArtistAttribution *ArtistAttributionSession) GetArtistIDs() ([]string, error) {
	return _ArtistAttribution.Contract.GetArtistIDs(&_ArtistAttribution.CallOpts)
}

// GetArtistIDs is a free data retrieval call binding the contract method 0xec32d942.
//
// Solidity: function getArtistIDs() view returns(string[])
func (_ArtistAttribution *ArtistAttributionCallerSession) GetArtistIDs() ([]string, error) {
	return _ArtistAttribution.Contract.GetArtistIDs(&_ArtistAttribution.CallOpts)
}

// GetCustomerImages is a free data retrieval call binding the contract method 0x55f21072.
//
// Solidity: function getCustomerImages(address customerAddress) view returns(uint256[])
func (_ArtistAttribution *ArtistAttributionCaller) GetCustomerImages(opts *bind.CallOpts, customerAddress common.Address) ([]*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getCustomerImages", customerAddress)

	if err != nil {
		return *new([]*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)

	return out0, err

}

// GetCustomerImages is a free data retrieval call binding the contract method 0x55f21072.
//
// Solidity: function getCustomerImages(address customerAddress) view returns(uint256[])
func (_ArtistAttribution *ArtistAttributionSession) GetCustomerImages(customerAddress common.Address) ([]*big.Int, error) {
	return _ArtistAttribution.Contract.GetCustomerImages(&_ArtistAttribution.CallOpts, customerAddress)
}

// GetCustomerImages is a free data retrieval call binding the contract method 0x55f21072.
//
// Solidity: function getCustomerImages(address customerAddress) view returns(uint256[])
func (_ArtistAttribution *ArtistAttributionCallerSession) GetCustomerImages(customerAddress common.Address) ([]*big.Int, error) {
	return _ArtistAttribution.Contract.GetCustomerImages(&_ArtistAttribution.CallOpts, customerAddress)
}

// GetImage is a free data retrieval call binding the contract method 0x2607aafa.
//
// Solidity: function getImage(uint256 id) view returns((uint256,address,string,string,string,string,bool,bool))
func (_ArtistAttribution *ArtistAttributionCaller) GetImage(opts *bind.CallOpts, id *big.Int) (ArtistAttributionImage, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getImage", id)

	if err != nil {
		return *new(ArtistAttributionImage), err
	}

	out0 := *abi.ConvertType(out[0], new(ArtistAttributionImage)).(*ArtistAttributionImage)

	return out0, err

}

// GetImage is a free data retrieval call binding the contract method 0x2607aafa.
//
// Solidity: function getImage(uint256 id) view returns((uint256,address,string,string,string,string,bool,bool))
func (_ArtistAttribution *ArtistAttributionSession) GetImage(id *big.Int) (ArtistAttributionImage, error) {
	return _ArtistAttribution.Contract.GetImage(&_ArtistAttribution.CallOpts, id)
}

// GetImage is a free data retrieval call binding the contract method 0x2607aafa.
//
// Solidity: function getImage(uint256 id) view returns((uint256,address,string,string,string,string,bool,bool))
func (_ArtistAttribution *ArtistAttributionCallerSession) GetImage(id *big.Int) (ArtistAttributionImage, error) {
	return _ArtistAttribution.Contract.GetImage(&_ArtistAttribution.CallOpts, id)
}

// GetImageCost is a free data retrieval call binding the contract method 0xa5f8e131.
//
// Solidity: function getImageCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) GetImageCost(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getImageCost")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetImageCost is a free data retrieval call binding the contract method 0xa5f8e131.
//
// Solidity: function getImageCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) GetImageCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.GetImageCost(&_ArtistAttribution.CallOpts)
}

// GetImageCost is a free data retrieval call binding the contract method 0xa5f8e131.
//
// Solidity: function getImageCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) GetImageCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.GetImageCost(&_ArtistAttribution.CallOpts)
}

// GetImageIDs is a free data retrieval call binding the contract method 0x53f4fa83.
//
// Solidity: function getImageIDs() view returns(uint256[])
func (_ArtistAttribution *ArtistAttributionCaller) GetImageIDs(opts *bind.CallOpts) ([]*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "getImageIDs")

	if err != nil {
		return *new([]*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new([]*big.Int)).(*[]*big.Int)

	return out0, err

}

// GetImageIDs is a free data retrieval call binding the contract method 0x53f4fa83.
//
// Solidity: function getImageIDs() view returns(uint256[])
func (_ArtistAttribution *ArtistAttributionSession) GetImageIDs() ([]*big.Int, error) {
	return _ArtistAttribution.Contract.GetImageIDs(&_ArtistAttribution.CallOpts)
}

// GetImageIDs is a free data retrieval call binding the contract method 0x53f4fa83.
//
// Solidity: function getImageIDs() view returns(uint256[])
func (_ArtistAttribution *ArtistAttributionCallerSession) GetImageIDs() ([]*big.Int, error) {
	return _ArtistAttribution.Contract.GetImageIDs(&_ArtistAttribution.CallOpts)
}

// ImageCost is a free data retrieval call binding the contract method 0xa6e99471.
//
// Solidity: function imageCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCaller) ImageCost(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "imageCost")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ImageCost is a free data retrieval call binding the contract method 0xa6e99471.
//
// Solidity: function imageCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionSession) ImageCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.ImageCost(&_ArtistAttribution.CallOpts)
}

// ImageCost is a free data retrieval call binding the contract method 0xa6e99471.
//
// Solidity: function imageCost() view returns(uint256)
func (_ArtistAttribution *ArtistAttributionCallerSession) ImageCost() (*big.Int, error) {
	return _ArtistAttribution.Contract.ImageCost(&_ArtistAttribution.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_ArtistAttribution *ArtistAttributionCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _ArtistAttribution.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_ArtistAttribution *ArtistAttributionSession) Owner() (common.Address, error) {
	return _ArtistAttribution.Contract.Owner(&_ArtistAttribution.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_ArtistAttribution *ArtistAttributionCallerSession) Owner() (common.Address, error) {
	return _ArtistAttribution.Contract.Owner(&_ArtistAttribution.CallOpts)
}

// ArtistCancelled is a paid mutator transaction binding the contract method 0xb864b6be.
//
// Solidity: function ArtistCancelled(string id) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) ArtistCancelled(opts *bind.TransactOpts, id string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "ArtistCancelled", id)
}

// ArtistCancelled is a paid mutator transaction binding the contract method 0xb864b6be.
//
// Solidity: function ArtistCancelled(string id) returns()
func (_ArtistAttribution *ArtistAttributionSession) ArtistCancelled(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistCancelled(&_ArtistAttribution.TransactOpts, id)
}

// ArtistCancelled is a paid mutator transaction binding the contract method 0xb864b6be.
//
// Solidity: function ArtistCancelled(string id) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) ArtistCancelled(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistCancelled(&_ArtistAttribution.TransactOpts, id)
}

// ArtistComplete is a paid mutator transaction binding the contract method 0x4b160fc0.
//
// Solidity: function ArtistComplete(string id) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) ArtistComplete(opts *bind.TransactOpts, id string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "ArtistComplete", id)
}

// ArtistComplete is a paid mutator transaction binding the contract method 0x4b160fc0.
//
// Solidity: function ArtistComplete(string id) returns()
func (_ArtistAttribution *ArtistAttributionSession) ArtistComplete(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistComplete(&_ArtistAttribution.TransactOpts, id)
}

// ArtistComplete is a paid mutator transaction binding the contract method 0x4b160fc0.
//
// Solidity: function ArtistComplete(string id) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) ArtistComplete(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistComplete(&_ArtistAttribution.TransactOpts, id)
}

// CreateArtist is a paid mutator transaction binding the contract method 0xe95b9bf4.
//
// Solidity: function CreateArtist(string id, string metadata) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactor) CreateArtist(opts *bind.TransactOpts, id string, metadata string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "CreateArtist", id, metadata)
}

// CreateArtist is a paid mutator transaction binding the contract method 0xe95b9bf4.
//
// Solidity: function CreateArtist(string id, string metadata) payable returns()
func (_ArtistAttribution *ArtistAttributionSession) CreateArtist(id string, metadata string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.CreateArtist(&_ArtistAttribution.TransactOpts, id, metadata)
}

// CreateArtist is a paid mutator transaction binding the contract method 0xe95b9bf4.
//
// Solidity: function CreateArtist(string id, string metadata) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) CreateArtist(id string, metadata string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.CreateArtist(&_ArtistAttribution.TransactOpts, id, metadata)
}

// CreateImage is a paid mutator transaction binding the contract method 0x7b232660.
//
// Solidity: function CreateImage(string _artistID, string _prompt) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactor) CreateImage(opts *bind.TransactOpts, _artistID string, _prompt string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "CreateImage", _artistID, _prompt)
}

// CreateImage is a paid mutator transaction binding the contract method 0x7b232660.
//
// Solidity: function CreateImage(string _artistID, string _prompt) payable returns()
func (_ArtistAttribution *ArtistAttributionSession) CreateImage(_artistID string, _prompt string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.CreateImage(&_ArtistAttribution.TransactOpts, _artistID, _prompt)
}

// CreateImage is a paid mutator transaction binding the contract method 0x7b232660.
//
// Solidity: function CreateImage(string _artistID, string _prompt) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) CreateImage(_artistID string, _prompt string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.CreateImage(&_ArtistAttribution.TransactOpts, _artistID, _prompt)
}

// ImageCancelled is a paid mutator transaction binding the contract method 0x782beca8.
//
// Solidity: function ImageCancelled(uint256 _id, string _errorMsg) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) ImageCancelled(opts *bind.TransactOpts, _id *big.Int, _errorMsg string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "ImageCancelled", _id, _errorMsg)
}

// ImageCancelled is a paid mutator transaction binding the contract method 0x782beca8.
//
// Solidity: function ImageCancelled(uint256 _id, string _errorMsg) returns()
func (_ArtistAttribution *ArtistAttributionSession) ImageCancelled(_id *big.Int, _errorMsg string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ImageCancelled(&_ArtistAttribution.TransactOpts, _id, _errorMsg)
}

// ImageCancelled is a paid mutator transaction binding the contract method 0x782beca8.
//
// Solidity: function ImageCancelled(uint256 _id, string _errorMsg) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) ImageCancelled(_id *big.Int, _errorMsg string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ImageCancelled(&_ArtistAttribution.TransactOpts, _id, _errorMsg)
}

// ImageComplete is a paid mutator transaction binding the contract method 0xc0ed368e.
//
// Solidity: function ImageComplete(uint256 _id, string _result) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) ImageComplete(opts *bind.TransactOpts, _id *big.Int, _result string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "ImageComplete", _id, _result)
}

// ImageComplete is a paid mutator transaction binding the contract method 0xc0ed368e.
//
// Solidity: function ImageComplete(uint256 _id, string _result) returns()
func (_ArtistAttribution *ArtistAttributionSession) ImageComplete(_id *big.Int, _result string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ImageComplete(&_ArtistAttribution.TransactOpts, _id, _result)
}

// ImageComplete is a paid mutator transaction binding the contract method 0xc0ed368e.
//
// Solidity: function ImageComplete(uint256 _id, string _result) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) ImageComplete(_id *big.Int, _result string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ImageComplete(&_ArtistAttribution.TransactOpts, _id, _result)
}

// AdminWithdraw is a paid mutator transaction binding the contract method 0xa28835b6.
//
// Solidity: function adminWithdraw(address to) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactor) AdminWithdraw(opts *bind.TransactOpts, to common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "adminWithdraw", to)
}

// AdminWithdraw is a paid mutator transaction binding the contract method 0xa28835b6.
//
// Solidity: function adminWithdraw(address to) payable returns()
func (_ArtistAttribution *ArtistAttributionSession) AdminWithdraw(to common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.AdminWithdraw(&_ArtistAttribution.TransactOpts, to)
}

// AdminWithdraw is a paid mutator transaction binding the contract method 0xa28835b6.
//
// Solidity: function adminWithdraw(address to) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) AdminWithdraw(to common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.AdminWithdraw(&_ArtistAttribution.TransactOpts, to)
}

// ArtistChangeWallet is a paid mutator transaction binding the contract method 0x009eb7e7.
//
// Solidity: function artistChangeWallet(string id, address newWallet) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) ArtistChangeWallet(opts *bind.TransactOpts, id string, newWallet common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "artistChangeWallet", id, newWallet)
}

// ArtistChangeWallet is a paid mutator transaction binding the contract method 0x009eb7e7.
//
// Solidity: function artistChangeWallet(string id, address newWallet) returns()
func (_ArtistAttribution *ArtistAttributionSession) ArtistChangeWallet(id string, newWallet common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistChangeWallet(&_ArtistAttribution.TransactOpts, id, newWallet)
}

// ArtistChangeWallet is a paid mutator transaction binding the contract method 0x009eb7e7.
//
// Solidity: function artistChangeWallet(string id, address newWallet) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) ArtistChangeWallet(id string, newWallet common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistChangeWallet(&_ArtistAttribution.TransactOpts, id, newWallet)
}

// ArtistWithdraw is a paid mutator transaction binding the contract method 0xd41b5485.
//
// Solidity: function artistWithdraw(string id) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactor) ArtistWithdraw(opts *bind.TransactOpts, id string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "artistWithdraw", id)
}

// ArtistWithdraw is a paid mutator transaction binding the contract method 0xd41b5485.
//
// Solidity: function artistWithdraw(string id) payable returns()
func (_ArtistAttribution *ArtistAttributionSession) ArtistWithdraw(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistWithdraw(&_ArtistAttribution.TransactOpts, id)
}

// ArtistWithdraw is a paid mutator transaction binding the contract method 0xd41b5485.
//
// Solidity: function artistWithdraw(string id) payable returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) ArtistWithdraw(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.ArtistWithdraw(&_ArtistAttribution.TransactOpts, id)
}

// DeleteArtist is a paid mutator transaction binding the contract method 0xd415380e.
//
// Solidity: function deleteArtist(string id) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) DeleteArtist(opts *bind.TransactOpts, id string) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "deleteArtist", id)
}

// DeleteArtist is a paid mutator transaction binding the contract method 0xd415380e.
//
// Solidity: function deleteArtist(string id) returns()
func (_ArtistAttribution *ArtistAttributionSession) DeleteArtist(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.DeleteArtist(&_ArtistAttribution.TransactOpts, id)
}

// DeleteArtist is a paid mutator transaction binding the contract method 0xd415380e.
//
// Solidity: function deleteArtist(string id) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) DeleteArtist(id string) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.DeleteArtist(&_ArtistAttribution.TransactOpts, id)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_ArtistAttribution *ArtistAttributionTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_ArtistAttribution *ArtistAttributionSession) RenounceOwnership() (*types.Transaction, error) {
	return _ArtistAttribution.Contract.RenounceOwnership(&_ArtistAttribution.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _ArtistAttribution.Contract.RenounceOwnership(&_ArtistAttribution.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_ArtistAttribution *ArtistAttributionSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.TransferOwnership(&_ArtistAttribution.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.TransferOwnership(&_ArtistAttribution.TransactOpts, newOwner)
}

// UpdateCost is a paid mutator transaction binding the contract method 0x6f55475d.
//
// Solidity: function updateCost(uint256 _artistCost, uint256 _imageCost, uint256 _artistCommission) returns()
func (_ArtistAttribution *ArtistAttributionTransactor) UpdateCost(opts *bind.TransactOpts, _artistCost *big.Int, _imageCost *big.Int, _artistCommission *big.Int) (*types.Transaction, error) {
	return _ArtistAttribution.contract.Transact(opts, "updateCost", _artistCost, _imageCost, _artistCommission)
}

// UpdateCost is a paid mutator transaction binding the contract method 0x6f55475d.
//
// Solidity: function updateCost(uint256 _artistCost, uint256 _imageCost, uint256 _artistCommission) returns()
func (_ArtistAttribution *ArtistAttributionSession) UpdateCost(_artistCost *big.Int, _imageCost *big.Int, _artistCommission *big.Int) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.UpdateCost(&_ArtistAttribution.TransactOpts, _artistCost, _imageCost, _artistCommission)
}

// UpdateCost is a paid mutator transaction binding the contract method 0x6f55475d.
//
// Solidity: function updateCost(uint256 _artistCost, uint256 _imageCost, uint256 _artistCommission) returns()
func (_ArtistAttribution *ArtistAttributionTransactorSession) UpdateCost(_artistCost *big.Int, _imageCost *big.Int, _artistCommission *big.Int) (*types.Transaction, error) {
	return _ArtistAttribution.Contract.UpdateCost(&_ArtistAttribution.TransactOpts, _artistCost, _imageCost, _artistCommission)
}

// ArtistAttributionEventArtistCreatedIterator is returned from FilterEventArtistCreated and is used to iterate over the raw logs and unpacked data for EventArtistCreated events raised by the ArtistAttribution contract.
type ArtistAttributionEventArtistCreatedIterator struct {
	Event *ArtistAttributionEventArtistCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ArtistAttributionEventArtistCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ArtistAttributionEventArtistCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ArtistAttributionEventArtistCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ArtistAttributionEventArtistCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ArtistAttributionEventArtistCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ArtistAttributionEventArtistCreated represents a EventArtistCreated event raised by the ArtistAttribution contract.
type ArtistAttributionEventArtistCreated struct {
	Artist ArtistAttributionArtist
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterEventArtistCreated is a free log retrieval operation binding the contract event 0x2601d70ca2b2a461f319bc3045fc9b845b0c5e2442eb0d8f419ed57a2359964f.
//
// Solidity: event EventArtistCreated((string,address,string,uint256,uint256,uint256,bool) artist)
func (_ArtistAttribution *ArtistAttributionFilterer) FilterEventArtistCreated(opts *bind.FilterOpts) (*ArtistAttributionEventArtistCreatedIterator, error) {

	logs, sub, err := _ArtistAttribution.contract.FilterLogs(opts, "EventArtistCreated")
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionEventArtistCreatedIterator{contract: _ArtistAttribution.contract, event: "EventArtistCreated", logs: logs, sub: sub}, nil
}

// WatchEventArtistCreated is a free log subscription operation binding the contract event 0x2601d70ca2b2a461f319bc3045fc9b845b0c5e2442eb0d8f419ed57a2359964f.
//
// Solidity: event EventArtistCreated((string,address,string,uint256,uint256,uint256,bool) artist)
func (_ArtistAttribution *ArtistAttributionFilterer) WatchEventArtistCreated(opts *bind.WatchOpts, sink chan<- *ArtistAttributionEventArtistCreated) (event.Subscription, error) {

	logs, sub, err := _ArtistAttribution.contract.WatchLogs(opts, "EventArtistCreated")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ArtistAttributionEventArtistCreated)
				if err := _ArtistAttribution.contract.UnpackLog(event, "EventArtistCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseEventArtistCreated is a log parse operation binding the contract event 0x2601d70ca2b2a461f319bc3045fc9b845b0c5e2442eb0d8f419ed57a2359964f.
//
// Solidity: event EventArtistCreated((string,address,string,uint256,uint256,uint256,bool) artist)
func (_ArtistAttribution *ArtistAttributionFilterer) ParseEventArtistCreated(log types.Log) (*ArtistAttributionEventArtistCreated, error) {
	event := new(ArtistAttributionEventArtistCreated)
	if err := _ArtistAttribution.contract.UnpackLog(event, "EventArtistCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ArtistAttributionEventImageCancelledIterator is returned from FilterEventImageCancelled and is used to iterate over the raw logs and unpacked data for EventImageCancelled events raised by the ArtistAttribution contract.
type ArtistAttributionEventImageCancelledIterator struct {
	Event *ArtistAttributionEventImageCancelled // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ArtistAttributionEventImageCancelledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ArtistAttributionEventImageCancelled)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ArtistAttributionEventImageCancelled)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ArtistAttributionEventImageCancelledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ArtistAttributionEventImageCancelledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ArtistAttributionEventImageCancelled represents a EventImageCancelled event raised by the ArtistAttribution contract.
type ArtistAttributionEventImageCancelled struct {
	Image ArtistAttributionImage
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterEventImageCancelled is a free log retrieval operation binding the contract event 0xe96570608b3d10656e0834bfc3fcc45b1e15f1659a0f95f0bd514ea112af3b50.
//
// Solidity: event EventImageCancelled((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) FilterEventImageCancelled(opts *bind.FilterOpts) (*ArtistAttributionEventImageCancelledIterator, error) {

	logs, sub, err := _ArtistAttribution.contract.FilterLogs(opts, "EventImageCancelled")
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionEventImageCancelledIterator{contract: _ArtistAttribution.contract, event: "EventImageCancelled", logs: logs, sub: sub}, nil
}

// WatchEventImageCancelled is a free log subscription operation binding the contract event 0xe96570608b3d10656e0834bfc3fcc45b1e15f1659a0f95f0bd514ea112af3b50.
//
// Solidity: event EventImageCancelled((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) WatchEventImageCancelled(opts *bind.WatchOpts, sink chan<- *ArtistAttributionEventImageCancelled) (event.Subscription, error) {

	logs, sub, err := _ArtistAttribution.contract.WatchLogs(opts, "EventImageCancelled")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ArtistAttributionEventImageCancelled)
				if err := _ArtistAttribution.contract.UnpackLog(event, "EventImageCancelled", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseEventImageCancelled is a log parse operation binding the contract event 0xe96570608b3d10656e0834bfc3fcc45b1e15f1659a0f95f0bd514ea112af3b50.
//
// Solidity: event EventImageCancelled((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) ParseEventImageCancelled(log types.Log) (*ArtistAttributionEventImageCancelled, error) {
	event := new(ArtistAttributionEventImageCancelled)
	if err := _ArtistAttribution.contract.UnpackLog(event, "EventImageCancelled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ArtistAttributionEventImageCompleteIterator is returned from FilterEventImageComplete and is used to iterate over the raw logs and unpacked data for EventImageComplete events raised by the ArtistAttribution contract.
type ArtistAttributionEventImageCompleteIterator struct {
	Event *ArtistAttributionEventImageComplete // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ArtistAttributionEventImageCompleteIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ArtistAttributionEventImageComplete)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ArtistAttributionEventImageComplete)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ArtistAttributionEventImageCompleteIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ArtistAttributionEventImageCompleteIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ArtistAttributionEventImageComplete represents a EventImageComplete event raised by the ArtistAttribution contract.
type ArtistAttributionEventImageComplete struct {
	Image ArtistAttributionImage
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterEventImageComplete is a free log retrieval operation binding the contract event 0x879c785b27857739316681a9c0aa7ab79114f2fb3bfc8c7eaa733dfedea46ad2.
//
// Solidity: event EventImageComplete((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) FilterEventImageComplete(opts *bind.FilterOpts) (*ArtistAttributionEventImageCompleteIterator, error) {

	logs, sub, err := _ArtistAttribution.contract.FilterLogs(opts, "EventImageComplete")
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionEventImageCompleteIterator{contract: _ArtistAttribution.contract, event: "EventImageComplete", logs: logs, sub: sub}, nil
}

// WatchEventImageComplete is a free log subscription operation binding the contract event 0x879c785b27857739316681a9c0aa7ab79114f2fb3bfc8c7eaa733dfedea46ad2.
//
// Solidity: event EventImageComplete((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) WatchEventImageComplete(opts *bind.WatchOpts, sink chan<- *ArtistAttributionEventImageComplete) (event.Subscription, error) {

	logs, sub, err := _ArtistAttribution.contract.WatchLogs(opts, "EventImageComplete")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ArtistAttributionEventImageComplete)
				if err := _ArtistAttribution.contract.UnpackLog(event, "EventImageComplete", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseEventImageComplete is a log parse operation binding the contract event 0x879c785b27857739316681a9c0aa7ab79114f2fb3bfc8c7eaa733dfedea46ad2.
//
// Solidity: event EventImageComplete((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) ParseEventImageComplete(log types.Log) (*ArtistAttributionEventImageComplete, error) {
	event := new(ArtistAttributionEventImageComplete)
	if err := _ArtistAttribution.contract.UnpackLog(event, "EventImageComplete", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ArtistAttributionEventImageCreatedIterator is returned from FilterEventImageCreated and is used to iterate over the raw logs and unpacked data for EventImageCreated events raised by the ArtistAttribution contract.
type ArtistAttributionEventImageCreatedIterator struct {
	Event *ArtistAttributionEventImageCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ArtistAttributionEventImageCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ArtistAttributionEventImageCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ArtistAttributionEventImageCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ArtistAttributionEventImageCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ArtistAttributionEventImageCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ArtistAttributionEventImageCreated represents a EventImageCreated event raised by the ArtistAttribution contract.
type ArtistAttributionEventImageCreated struct {
	Image ArtistAttributionImage
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterEventImageCreated is a free log retrieval operation binding the contract event 0x894fec21971efec05c3480d0e1893e2384f8d07a22587ae28f7adcf1afc63f0d.
//
// Solidity: event EventImageCreated((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) FilterEventImageCreated(opts *bind.FilterOpts) (*ArtistAttributionEventImageCreatedIterator, error) {

	logs, sub, err := _ArtistAttribution.contract.FilterLogs(opts, "EventImageCreated")
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionEventImageCreatedIterator{contract: _ArtistAttribution.contract, event: "EventImageCreated", logs: logs, sub: sub}, nil
}

// WatchEventImageCreated is a free log subscription operation binding the contract event 0x894fec21971efec05c3480d0e1893e2384f8d07a22587ae28f7adcf1afc63f0d.
//
// Solidity: event EventImageCreated((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) WatchEventImageCreated(opts *bind.WatchOpts, sink chan<- *ArtistAttributionEventImageCreated) (event.Subscription, error) {

	logs, sub, err := _ArtistAttribution.contract.WatchLogs(opts, "EventImageCreated")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ArtistAttributionEventImageCreated)
				if err := _ArtistAttribution.contract.UnpackLog(event, "EventImageCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseEventImageCreated is a log parse operation binding the contract event 0x894fec21971efec05c3480d0e1893e2384f8d07a22587ae28f7adcf1afc63f0d.
//
// Solidity: event EventImageCreated((uint256,address,string,string,string,string,bool,bool) image)
func (_ArtistAttribution *ArtistAttributionFilterer) ParseEventImageCreated(log types.Log) (*ArtistAttributionEventImageCreated, error) {
	event := new(ArtistAttributionEventImageCreated)
	if err := _ArtistAttribution.contract.UnpackLog(event, "EventImageCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ArtistAttributionOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the ArtistAttribution contract.
type ArtistAttributionOwnershipTransferredIterator struct {
	Event *ArtistAttributionOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ArtistAttributionOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ArtistAttributionOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ArtistAttributionOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ArtistAttributionOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ArtistAttributionOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ArtistAttributionOwnershipTransferred represents a OwnershipTransferred event raised by the ArtistAttribution contract.
type ArtistAttributionOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_ArtistAttribution *ArtistAttributionFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*ArtistAttributionOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _ArtistAttribution.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &ArtistAttributionOwnershipTransferredIterator{contract: _ArtistAttribution.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_ArtistAttribution *ArtistAttributionFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *ArtistAttributionOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _ArtistAttribution.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ArtistAttributionOwnershipTransferred)
				if err := _ArtistAttribution.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_ArtistAttribution *ArtistAttributionFilterer) ParseOwnershipTransferred(log types.Log) (*ArtistAttributionOwnershipTransferred, error) {
	event := new(ArtistAttributionOwnershipTransferred)
	if err := _ArtistAttribution.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
