// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LilypadCallerInterface.sol";

error LilypadEventsError();

/**
    @notice An experimental contract for POC work to call Bacalhau jobs from FVM smart contracts
*/
contract LilypadEvents is Ownable {
    using Counters for Counters.Counter; // create job id's?
    Counters.Counter private _jobIds;

    // only this contract is allowed to call this bridge
    address private authorizedContract;

    constructor() {
        
    }

    struct BacalhauJob {
        address requestor;
        // unique id - though uint only goes up to 2^265 -1 so probably want to handle
        // this better in future maybe a hash
        uint id;
        // stingified params? Seems rife for errors - we may need to consider a
        // Base contract and several others that verify details before calling
        // bacalhau. Or multiple functions in here to call specific things +
        // generic job
        string spec;
        // what type of result the job wants to receive
        LilypadResultType resultType;
    }

    //testing
    struct BacalhauJobResult {
        address requestor;
        uint id;
        bool success;
        string result;
        LilypadResultType resultType;
    }

    BacalhauJob[] public bacalhauJobHistory; //complete history of all jobs
    BacalhauJobResult[] public bacalhauJobResultHistory;
    mapping(address => BacalhauJobResult[]) bacalhauJobResultByAddress; // jobs by requestor

    event NewBacalhauJobSubmitted(BacalhauJob job);
    event BacalhauJobResultsReturned(BacalhauJobResult result);

    // only this contract is allowed to call "runBacalhauJob"
    // this is to stop anyone triggering bacalhau jobs for free on our
    // artists stable diffusion cluster
    function setAuthorizedContract(address _authorizedContract) public onlyOwner {
      authorizedContract = _authorizedContract;
    }

    modifier callerIsAuthorizedContract() {
      require(msg.sender == authorizedContract, "Can only be called from authorized contract address");
      _;
    }

    //msg.sender is always the address where the current (external) function call came from.
    //need interface for different jobs available to verify params before sending
    function runBacalhauJob(address _from, string memory _spec, LilypadResultType _resultType) public callerIsAuthorizedContract returns (uint) {
        _jobIds.increment();
        uint thisJobId = _jobIds.current();
        BacalhauJob memory jobCalled = BacalhauJob({
            requestor: _from,
            id: thisJobId,
            spec: _spec,
            resultType: _resultType
        });

        bacalhauJobHistory.push(jobCalled);
        emit NewBacalhauJobSubmitted(jobCalled);
        return thisJobId;
    }

    function currentJobID() public view returns (uint) {
        return _jobIds.current();
    }

    function returnBacalhauResults(address _to, uint _jobId, LilypadResultType _resultType, string memory _result) public onlyOwner {
        BacalhauJobResult memory jobResult = BacalhauJobResult({
            requestor: _to,
            id: _jobId,
            result: _result,
            success: true,
            resultType: _resultType
        });
        bacalhauJobResultHistory.push(jobResult);
        bacalhauJobResultByAddress[_to].push(jobResult);

        emit BacalhauJobResultsReturned(jobResult);
        LilypadCallerInterface(_to).lilypadFulfilled(address(this), _jobId, _resultType, _result);
    }

    function returnBacalhauError(address _to, uint _jobId, string memory _errorMsg) public onlyOwner {
        BacalhauJobResult memory jobResult = BacalhauJobResult({
            requestor: _to,
            id: _jobId,
            success: false,
            result: _errorMsg,
            resultType: LilypadResultType.StdErr
        });
        bacalhauJobResultHistory.push(jobResult);
        bacalhauJobResultByAddress[_to].push(jobResult);

        emit BacalhauJobResultsReturned(jobResult);
        LilypadCallerInterface(_to).lilypadCancelled(address(this), _jobId, _errorMsg);
    }

    function fetchAllJobs() public view returns (BacalhauJob[] memory) {
        return bacalhauJobHistory;
    }

    function fetchAllResults() public view returns (BacalhauJobResult[] memory) {
        return bacalhauJobResultHistory;
    }

    function fetchJobsByAddress(address _requestor) public view returns (BacalhauJobResult[] memory) {
        return bacalhauJobResultByAddress[_requestor];
    }
}