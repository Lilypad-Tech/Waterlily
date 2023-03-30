// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// https://docs.openzeppelin.com/contracts/4.x/erc721 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol"; 

contract WaterlilyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct waterlilyFRC721NFT {
        address owner;
        string tokenURI;
        uint256 tokenId;
    }

    waterlilyFRC721NFT[] public nftCollection;
    mapping(address => waterlilyFRC721NFT[]) public nftCollectionByOwner;

    event NewWaterlilyFRC721NFTMinted(
      address indexed sender,
      uint256 indexed tokenId,
      string tokenURI
    );

    constructor() ERC721("Waterlily NFTs", "WAI") {
      console.log("Hello Fil-ders! Now creating Waterlily FRC721 NFT contract!");
    }

    function mintWaterlilyNFT(address owner, string memory ipfsURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();

        waterlilyFRC721NFT memory newNFT = waterlilyFRC721NFT({
            owner: msg.sender,
            tokenURI: ipfsURI,
            tokenId: newItemId
        });

        _mint(owner, newItemId);
        _setTokenURI(newItemId, ipfsURI);
        nftCollectionByOwner[owner].push(newNFT);

        _tokenIds.increment();

        nftCollection.push(newNFT);

        emit NewWaterlilyFRC721NFTMinted(
          msg.sender,
          newItemId,
          ipfsURI
        );

        return newItemId;
    }

    /**
     * @notice helper function to display NFTs for frontends
     */
    function getNFTCollection() public view returns (waterlilyFRC721NFT[] memory) {
        return nftCollection;
    }

    /**
     * @notice helper function to fetch NFT's by owner
     */
    function getNFTCollectionByOwner(address owner) public view returns (waterlilyFRC721NFT[] memory){
        return nftCollectionByOwner[owner];
    }
    
        /**
    */
    function mintMultipleWaterlilyNFTs(address owner, string[] memory ipfsMetadata) public returns (uint256[] memory)
    {
        console.log('minting waterlily nfts');

        //get length of ipfsMetadata array
        uint256 length = ipfsMetadata.length;
        uint256[] memory tokenIdArray = new uint256[](length);

        //loop through calling mintWaterlilyNFT for each
        uint j=0;
        for (j = 0; j < length; j ++) {  //for loop example
            tokenIdArray[j] = mintWaterlilyNFT(owner, ipfsMetadata[j]);     
        }

        return tokenIdArray;
    }

    /** Possibilites
        Add Royalty payments on resell to original artists
        
    */
}