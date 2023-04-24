// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./LilypadEvents.sol";
import "./LilypadCallerInterface.sol";

error WaterlilyError();

contract Waterlily is LilypadCallerInterface, Ownable {
    /** General Variables */
    address public lilypadBridgeAddress;
    uint256 lilypadFee = 0.03 * 10**18;
    
    // These are used in order to ensure the lilypad wallet can cover gas fees
    // for returning an image to the contract on FVM mainnet. (no charge on testnet, we auto topup tFIL)
    // The bacalhau network doesn't charge for use.
    uint256 public computeProviderEscrow;
    uint256 public computeProviderRevenue;

    uint256 public imageCost = 0.13 * 10**18;
    
    uint256 public artistCommission;
    uint256 public artistCost;
    uint256 public artistAutoPaymentMin;


    /** Contract Events **/
    event ArtistCreated(string indexed artistId);
    event ArtistDeleted(string indexed artistId);
    event ArtistWalletUpdated(string indexed artistId, address _prevWallet, address _curWallet);
    event ArtistPaid(string indexed artistId, address _paidTo, uint256 amountPaid);
    event ImageJobCalled(Image image);
    event ImageComplete(Image image); //we shouldn't broadcast the results publicly in reality.
    event ImageCancelled(Image image);

    /** Artist Data Structures / vars **/
    struct Artist {
        string id;
        address wallet;
        uint256 escrow;
        uint256 revenue;
        uint256 numJobsRun;
        bool isTrained;
    }
    mapping (string => Artist) artists;
    string[] artistIDs;

    /** Image Events **/
    event ImageCreated(Image image);

    /** Image Data Structures / vars **/
    using Counters for Counters.Counter; 
    Counters.Counter private _jobIds;
   
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
    
    mapping (uint => Image) images; 
    mapping (address => uint[]) customerImages;

    /** Initialise our contract vars **/
    function initialise() public onlyOwner {

    }

        /** Artist Functions **/
    function getArtistIds() public view returns (string[] memory) {
        return artistIDs; 
    }

    function getArtistById(string calldata _artistId) public view returns (Artist memory) {
        return artists[_artistId];
    }

    function artistWithdrawFunds(string calldata _artistId) public payable {
        require(bytes(artists[_artistId].id).length > 0, "artist does not exist");
        Artist storage artist = artists[_artistId];
        require(artist.wallet == msg.sender, "only the artist's wallet can call this function");
        require(artist.escrow > 0, "artist does not have any money to withdraw"); 
        uint256 escrowToSend = artist.escrow;
        artist.escrow = 0;
        address payable to = payable(msg.sender);
        to.transfer(escrowToSend);
    }

    function createArtist(string calldata _artistId) external payable {
        require(bytes(_artistId).length > 0, "please provide an id");
        require(bytes(artists[_artistId].id).length == 0, "artist already exists");
        require(msg.value >= artistCost, "not enough FIL sent to pay for training artist");
        if(bytes(artists[_artistId].id).length == 0) {
            artistIDs.push(_artistId);
        }
        artists[_artistId] = Artist({
                id: _artistId,
                wallet: msg.sender,
                escrow: 0,
                revenue: 0,
                numJobsRun: 0,
                isTrained: false
         });
        emit ArtistCreated(_artistId); 
        // we don't directly trigger training of models via this function
        // though it would be possible to do with lilypad

    }

    function deleteArtist(string calldata id) public onlyOwner {
        require(bytes(artists[id].id).length > 0, "artist does not exist");
        Artist storage artist = artists[id];
        require(artist.escrow == 0, "please have the artist withdraw escrow first"); // they have money still to claim
        delete(artists[id]);
        for (uint i = 0; i < artistIDs.length; i++) {
            if (keccak256(abi.encodePacked((artistIDs[i]))) ==       
                    keccak256(abi.encodePacked((id)))) 
            {
                artistIDs[i] = artistIDs[artistIDs.length - 1];
                artistIDs.pop();
                break;
            }
        }
    }

    function updateArtistWallet(string calldata _artistId, address _newWalletAddress) public {
        require(bytes(artists[_artistId].id).length > 0, "artist does not exist");
        Artist storage artist = artists[_artistId];
        require(artist.wallet == msg.sender || msg.sender == owner(), "only the artist's wallet can call this function"); //artist or owner
        artist.wallet = _newWalletAddress;
    }

    /** Image Functions **/
    function getCustomerImages(address customerAddress) public view returns (uint[] memory) {
        return customerImages[customerAddress];
    }

    function createImage(string calldata _artistId, string calldata _prompt) external payable {
        require(bytes(artists[_artistId].id).length > 0, "Artist does not exist");
        require(artists[_artistId].isTrained, "Artist has not been trained");
        require(msg.value >= imageCost, "Not enough FIL sent to pay for image generation");
        // note 

        _jobIds.increment();
        uint id = _jobIds.current();

        images[id] = Image({
            id: id,
            customer: msg.sender,
            artist: _artistId,
            prompt: _prompt,
            ipfsResult: "",
            errorMessage: "",
            isComplete: false,
            isCancelled: false
        });

        customerImages[msg.sender].push(id);

        // this is where we call the lilypad bridging contract
        /** NOTE: In reality each of your artists would need a different bacalhau job spec as each 
        artist uses a unique model to generate images in their specific style. 
        You can try this using the alternative method for your different specifications: 
        -> function runLilypadJob(address _from, string memory _specName, string memory _spec, LilypadResultType _resultType)
        Where _specName == "CustomSpec"
    **/
        string memory spec = "StableDiffusion"; //this is defined in LilypadEvents contract

         // Call the function in the other contract and send funds
        (bool success, ) = lilypadBridgeAddress.call{value: lilypadFee}(abi.encodeWithSignature("runLilypadJob(address, bytes, uint256)", address(this), spec, uint256(LilypadResultType.CID)));
        require(success, "Failed to call the lilypad Events function to run the job.");

        emit ImageJobCalled(images[id]);
        uint excess = msg.value - imageCost;
        if (excess > 0) {
            address payable to = payable(msg.sender);
            to.transfer(excess);
        }
    }

    /** Lilypad Functions (as I said - this is in alpha!) **/
    function lilypadFulfilled(address _from, uint _jobId, LilypadResultType _resultType, string calldata _result) external override {
    //the image has come back successfully
        Image storage image = images[_jobId];
        // sanity check that the image exists with that ID
        require(image.id > 0, "image does not exist");
        require(image.isComplete == false, "image already complete");
        require(image.isCancelled == false, "image was cancelled");
    
        // get a reference to the artist for this image
        Artist storage artist = artists[image.artist];

        // edge case where we deleted the artist in between the job
        // starting and completing
        require(bytes(artist.id).length > 0, "artist does not exist");

         // update the result of the image
        image.ipfsResult = _result;
        image.isComplete = true;

        // update the artist details accordingly
        artist.escrow += artistCommission;
        artist.revenue += artistCommission;
        artist.numJobsRun += 1;
        computeProviderEscrow += imageCost - artistCommission;
        computeProviderRevenue += imageCost - artistCommission;

        //auto-pay the artist if their escrow is > AutopayMinValue
        if(artist.escrow > artistAutoPaymentMin){
            uint256 escrowToSend = artist.escrow;
            address payable recipient = payable(artist.wallet);
            //should check contract balance here before proceeding
            artist.escrow = 0;
            recipient.transfer(escrowToSend);
            emit ArtistPaid(artist.id, recipient, escrowToSend);
        }

        emit ImageComplete(image);
        
    }

    function lilypadCancelled(address _from, uint _jobId, string calldata _errorMsg) external override {
        //something went wrong with the job - refund customer as much as possible
        Image storage image = images[_jobId];

        // sanity check that the image exists with that ID
        require(image.id > 0, "image does not exist");
        require(image.isComplete == false, "image already complete");
        require(image.isCancelled == false, "image was cancelled");

        // mark the image as cancelled and refund the customer
        image.isCancelled = true;
        image.errorMessage = _errorMsg;
        
        // in reality you might want to subtract the cost of the newtork gas costs for the bridge return here
        uint256 amountRefundable = imageCost; //-lilypad costs
        address payable to = payable(image.customer);
        to.transfer(amountRefundable);

        emit ImageCancelled(image);
    }
}