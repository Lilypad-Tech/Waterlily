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
contract ArtistAttribution is Ownable {
    using Counters for Counters.Counter; // create job id's?
    Counters.Counter private _jobIds;

    uint256 public computeProviderEscrow;
    uint256 public computeProviderRevenue;

    uint256 public imageCost;
    uint256 public artistCost;
    uint256 public artistCommission;

    struct Image {
        uint id;
        address customer;
        string artist;
        string prompt;
        string ipfsResult;
        string errorMessage;
        bool isComplete;
        bool isCancelled;
    }

    struct Artist {
        // this id a string that is the same as the prompt we use for stable diffusion
        string id;
        address wallet;
        /**
          an IPFS CID of the artists metadata? eg. portfolio links etc.
          Artist Style : string
          Artist Portfolio link : string

        */
        string metadata;
        uint256 escrow; // amount of FIL owed that can be withdrawn right now
        uint256 revenue; // total amount of revenue earned
        uint256 numJobsRun; // total numbner of jobs run

        // have we completed the artist training job?
        // only the admin can update this
        // (because it's the bridge that is updating this value)
        bool isTrained;
    }

    // mapping of image id onto the image
    mapping (uint => Image) images;

    // array of all previous image ids
    uint[] imageIDs;

    // mapping of artist id onto artist struct
    mapping (string => Artist) artists;
    // we need this so we can itetate over the artists
    string[] artistIDs;

    // a map of customer address onto images they have submitted
    mapping (address => uint[]) customerImages;

    event EventImageCreated(Image image);
    event EventImageComplete(Image image);
    event EventImageCancelled(Image image);
    event EventArtistCreated(Artist artist);

    constructor(
      uint256 _artistCost,
      uint256 _imageCost,
      uint256 _artistCommission
    ) {
        _updateCost(_artistCost, _imageCost, _artistCommission);
    }

    function getArtistIDs() public view returns (string[] memory) {
        return artistIDs;
    }

    function getArtist(string calldata id) public view returns (Artist memory) {
        return artists[id];
    }

    function getImageCost() public view returns (uint256) {
        return imageCost;
    }

    function getArtistCommission() public view returns (uint256) {
        return artistCommission;
    }

    function getImageIDs() public view returns (uint[] memory) {
        return imageIDs;
    }

    function getImage(uint id) public view returns (Image memory) {
        return images[id];
    }

    function getCustomerImages(address customerAddress) public view returns (uint[] memory) {
        return customerImages[customerAddress];
    }

    function updateCost(uint256 _artistCost, uint256 _imageCost, uint256 _artistCommission) public onlyOwner {
      _updateCost(_artistCost, _imageCost, _artistCommission);
    }

    function _updateCost(uint256 _artistCost, uint256 _imageCost, uint256 _artistCommission) private {
        require(_artistCommission <= _imageCost, "artist commission must be less than or equal to image cost");
        if(_artistCost == 0) {
          // how much gwei does it cost to register as an artist?
          _artistCost = DEFAULT_ARTIST_COST;
        }

        if(_imageCost == 0) {
          // how much gwei does it cost to run a job?
          // this is 0.00065 ETH then converted to Filecoin
          // it represents around $0.50
          _imageCost = DEFAULT_IMAGE_COST;
        }

        if(_artistCommission == 0) {
          // how much gewi does the artist get?
          // this is expressed as gwei but is basically a percentage of 20%
          _artistCommission = DEFAULT_ARTIST_COMMISSION;
        }

        artistCost = _artistCost;
        imageCost = _imageCost;
        artistCommission = _artistCommission;
    }

    function artistChangeWallet(string calldata id, address newWallet) public {
        require(bytes(artists[id].id).length > 0, "artist does not exist");
        Artist storage artist = artists[id];
        require(artist.wallet == msg.sender, "only the artist's wallet can call this function");
        artist.wallet = newWallet;
    }

    function deleteArtist(string calldata id) public onlyOwner {
        require(bytes(artists[id].id).length > 0, "artist does not exist");
        Artist storage artist = artists[id];
        require(artist.escrow == 0, "please have the artist withdraw escrow first"); // they have money still to claim
        delete(artists[id]);
        // remove from artistIDs
        for (uint i = 0; i < artistIDs.length; i++) {
            if (keccak256(abi.encodePacked((artistIDs[i]))) == keccak256(abi.encodePacked((id)))) {
                artistIDs[i] = artistIDs[artistIDs.length - 1];
                artistIDs.pop();
                break;
            }
        }
    }

    function artistWithdraw(string calldata id) public payable {
        require(bytes(artists[id].id).length > 0, "artist does not exist");
        Artist storage artist = artists[id];
        require(artist.wallet == msg.sender, "only the artist's wallet can call this function");
        require(artist.escrow > 0, "artist does not have any money to withdraw");
        uint256 escrowToSend = artist.escrow;
        artist.escrow = 0;
        address payable to = payable(msg.sender);
        to.transfer(escrowToSend);
    }

    function adminWithdraw(address payable to) public payable onlyOwner {
        uint256 escrowToSend = computeProviderEscrow;
        computeProviderEscrow = 0;
        to.transfer(escrowToSend);
    }

    function CreateArtist(string calldata id, string calldata metadata) external payable {
        require(bytes(id).length > 0, "please provide an id");
        require(bytes(artists[id].id).length == 0, "artist already exists");
        require(msg.value >= artistCost, "not enough FIL sent to pay for training artist");
        if(bytes(artists[id].id).length == 0) {
          artistIDs.push(id);
        }
        artists[id] = Artist({
          id: id,
          wallet: msg.sender,
          metadata: metadata,
          escrow: 0,
          revenue: 0,
          numJobsRun: 0,
          isTrained: false
        });
    }

    // the training step has completed - update this artist as "isTrained"
    function ArtistComplete(string calldata id) public onlyOwner {
        require(bytes(artists[id].id).length > 0, "artist does not exist");
        Artist storage artist = artists[id];
        require(artist.isTrained == false, "artisthas already been trained");
        artist.isTrained = true;
    }

    function ArtistCancelled(string calldata id) public onlyOwner {
        require(bytes(artists[id].id).length > 0, "artist does not exist");
        deleteArtist(id);
        Artist storage artist = artists[id];
        address payable to = payable(artist.wallet);
        to.transfer(artistCost);
    }

    function CreateImage(string calldata _artistID, string calldata _prompt) external payable {
        require(bytes(artists[_artistID].id).length > 0, "artist does not exist");
        require(artists[_artistID].isTrained, "artist has not been trained");
        require(msg.value >= imageCost, "not enough FIL sent to pay for image");

        _jobIds.increment();
        uint id = _jobIds.current();

        images[id] = Image({
            id: id,
            customer: msg.sender,
            artist: _artistID,
            prompt: _prompt,
            ipfsResult: "",
            errorMessage: "",
            isComplete: false,
            isCancelled: false
        });
        imageIDs.push(id);
        customerImages[msg.sender].push(id);
        emit EventImageCreated(images[id]);

        // if they have paid too much then refund the difference
        uint excess = msg.value - imageCost;
        if (excess > 0) {
          address payable to = payable(msg.sender);
          to.transfer(excess);
        }
    }

    function ImageComplete(uint _id, string calldata _result) public onlyOwner {
        // get a reference to the image
        Image storage image = images[_id];

        // sanity check that the image exists with that ID
        require(image.id > 0, "image does not exist");
        // this is important otherwise we are paying out multiple times for the same image
        require(image.isComplete == false, "image already complete");
        require(image.isCancelled == false, "image was cancalled");

        // get a reference to the artist for this image
        Artist storage artist = artists[image.artist];

        // edge case where we deleted the artist in between the job
        // starting and completing
        require(bytes(artist.id).length > 0, "artist does not exist");

        // update the result of the image
        image.ipfsResult = _result;
        image.isComplete = true;

        // increase the commission for the artist
        artist.escrow += artistCommission;
        artist.revenue += artistCommission;
        artist.numJobsRun += 1;
        computeProviderEscrow += imageCost - artistCommission;
        computeProviderRevenue += imageCost - artistCommission;

        // TODO: automatically transfer compute provider funds to bridge wallet
        // if computeProviderEscrow > Y
        // this means we don't pay the gas and it's automatic

        emit EventImageComplete(image);
    }

    function ImageCancelled(uint _id, string calldata _errorMsg) public onlyOwner {
        // get a reference to the image
        Image storage image = images[_id];

        // sanity check that the image exists with that ID
        require(image.id > 0, "image does not exist");
        require(image.isComplete == false, "image already complete");
        require(image.isCancelled == false, "image was cancalled");

        // mark the image as cancelled and refund the customer
        image.isCancelled = true;
        image.errorMessage = _errorMsg;

        address payable to = payable(image.customer);
        to.transfer(imageCost);

        // TODO: let's keep a small percentage of the fee
        // to cover bridge gas costs

        emit EventImageCancelled(image);
    }
}
