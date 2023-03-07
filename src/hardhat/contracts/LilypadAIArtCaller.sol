// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./LilypadCallerInterface.sol";

error LilypadAIArtCallerError();

/**
Req's:
- Implements LilypadCallerInterface 
- keeps models secure (models should not be able to be called from any contract other than this one.. hmm)
- should be upgradeable? 

 */

// Front end needs something to listen for to update
//event LilypadEventFulfilled

contract LilypadAIArtCaller is LilypadCallerInterface {

  struct lilypadAIArtResult {
    address caller;
    string ipfsCID;
    //jobID?
  }
  //Should only be callable by owner
  mapping(address => lilypadAIArtResult[]) private lilypadAIArtResults;

  // Front end needs something to listen for to update
  //event LilypadEventReturned (includes failure)

  function generateClicked (string memory promptInput, string memory artistStyleName) public payable {
    //when sent to events - need to include the jobID?

     //require wallet to have 2x gas needed (how to calculate return gas reuirements?)
      //  plus cost of running baclahau job (how to calculate this + profit) 
            // rough guide: minutes per stable diffusion job (5) times cost per node with a gpu ($2/hr)? = 16.7c + some profit margin here for dev work etc = 25c
            // ideally we are going to always need the current price of Filecoin to do a semi-accurate account on this
      //  plus payment for artist (what to set this at??)

    //send funds to Bacalhauescrow. (incl Bac funds.)
      //on failure revert bac costs?

    //sends funds to ArtistEscrow

    //call Bacalhau job with prompt input and artist style id. (artist style id needs to be shared by front end and baclhau)


   }

  function lilypadFulfilled(address _from, uint _jobId, string memory _jobName, string memory _ipfsResult) {
    //trigger event
  }

  function lilypadCancelled(address _from, uint _jobId, string memory _jobName, string memory _errorMsg) {
    //trigger event with failure flag
  }


}