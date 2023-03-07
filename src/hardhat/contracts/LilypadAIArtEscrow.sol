// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


error LilypadAIArtEscrowError();

/** 
@notice This contract is a POC for providing payments to artists when users generate stable diffusion images from their art styles
*/


/**
This contract
- keeps a list of payment amounts owed to artists?
- has owner and access roles
- has security against reentrancy attacks
- should be tested by some basic security tools at least
*/

/**
Contract story
- User clicks generate button
- Contract checks wallet 

 */


contract LilypadAIArtEscrow is Initializable, AccessControlUpgradeable, UUPSUpgradeable {

  bytes32 public constant ARTIST_ROLE = keccak("ARTIST_ROLE");

  //I'm wondering if we should store all artist metadata in an IPFS CID
  // this can be read by the frontend.
  struct Artist {
    address artistWallet;
    string metadata; //an IPFS CID of the artists metadata? eg. portfolio links etc.
    /**
      Artist Style : string
      Artist Portfolio link : string
      
     */
    uint256 balance; //amount of FIL owed
    uint256 revenue; //amount of revenue earned
    uint256 numJobsRun; //how many times an artist style has been called
  }

  mapping(address => boolean) private isArtistAddress;
  mapping(address => uint256) private artistBalance;

  /**
  State needed:
    - Bacalhau payment wallet (or escrow contract - use LilypadEscrow)
    - Artist payment wallet (prob escrow contract needing more than one confirmation for artist wallet address to be changed)
   */



  /**
  Functions needed

   */

  function withdraw() {
    require(hasRole(ARTIST_ROLE, msg.sender), "Only an Artist can withdraw");
    //require(hasBalance > 0)
  }


  //only updates the metadata - nothing else. OnlyArtist modifier needed.
  function updateArtistMetadata(string ipfsCID) {

  }


}