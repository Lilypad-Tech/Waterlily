// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// this is the default cost of an image
// it's about $5 cents
uint256 constant DEFAULT_ARTIST_COST = 650000000000000 * 2500;
// this is the default cost of an image
// it's about 50 cents
uint256 constant DEFAULT_IMAGE_COST = 650000000000000 * 250;
// this is 100% of the image cost – compute providers get nothing
uint256 constant DEFAULT_ARTIST_COMMISSION = 650000000000000 * 250;

/**
    @notice An experimental contract for POC work to call Bacalhau jobs from FVM smart contracts
*/
contract Test {
    
    constructor(
      uint num
    ) {
        require(num == 1, "num must be 1");
    }

}
