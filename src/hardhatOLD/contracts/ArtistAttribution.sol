// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LilypadEvents.sol";
import "./LilypadCallerInterface.sol";

/**
    @notice An experimental contract for POC work to call Bacalhau jobs from FVM smart contracts
*/
contract ArtistAttribution is LilypadCallerInterface, Ownable {
    LilypadEvents public bridge;

    uint32 public computeProviderEscrow;
    uint32 public computeProviderRevenue;

    uint32 public imageCost;
    uint32 public artistCommission;

    struct StableDiffusionImage {
        uint id;
        address customer;
        string artist;
        string prompt;
        string ipfsResult;
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
    }

    // mapping of image id onto the image
    mapping (uint => StableDiffusionImage) images;

    // array of all previous image ids
    uint[] imageIDs;

    // mapping of artist id onto artist struct
    mapping (string => Artist) artists;
    // mapping of artist address onto their ID
    // this makes withdraw easier where we only know thier address
    mapping (address => string) artistAddresses;

    event ImageGenerated(StableDiffusionImage image);
    event ImageCancelled(StableDiffusionImage image);

    constructor(
      address _eventsContractAddress,
      uint32 _imageCost,
      uint32 _artistCommission,
    ) {
        require(_artistCommission <= _imageCost, "ArtistAttribution: artist commission must be less than image cost");
        console.log("Deploying StableDiffusion contract");
        bridge = LilypadEvents(_eventsAddress);

        if(_imageCost == 0) {
          // how much gwei does it cost to run a job?
          // this is 0.00065 ETH then converted to Filecoin
          // it represents around $0.50
          _imageCost = 650000000000000 * 250;
        }

        if(_artistCommission == 0) {
          // how much gewi does the artist get?
          // this is expressed as gwei but is basically a percentage of 20%
          _artistCommission = 650000000000000 * 50;
        }
        
        imageCost = _imageCost;
        artistCommission = _artistCommission;   
    }

    string constant spec1 = '{'
        '"Engine": "docker",'
        '"Verifier": "noop",'
        '"Publisher": "estuary",'
        '"Docker": {'
        '"Image": "ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:';

    string constant spec2 = '",'
        '"Entrypoint": ["python", "main.py", "--o", "./outputs", "--p", "';
        
    string constant spec3 =
        '"]},'
        '"Resources": {"GPU": "1"},'
        '"Outputs": [{"Name": "outputs", "Path": "/outputs"}],'
        '"Deal": {"Concurrency": 1}'
        '}';

    function StableDiffusion(string calldata _artistID, string calldata _prompt) external payable {
        require(artists[_artistID].id != "", "ArtistAttribution: artist does not exist");
        require(msg.value >= imageCost, "ArtistAttribution: not enough FIL sent to pay for image");

        string memory actualPrompt = string.concat(_prompt, ' in the style of ', _artistID);
        string memory tag = _artistID

        // TODO: delete this once we've got images tagged with the artist id
        tag = "0.0.1"

        // TODO: replace double quotes in the prompt otherwise our JSON breaks
        // TODO: do proper json encoding, look out for quotes in _prompt
        string memory spec = string.concat(spec1, tag, spec2, actualPrompt, spec3);
        
        // run the job in lilypad and get the id back
        // record the image so we can reference it when the callbacks are triggered
        uint id = bridge.runBacalhauJob(address(this), spec, LilypadResultType.CID);
        images[id] = StableDiffusionImage({
            id: id,
            customer: msg.sender,
            artist: _artistID,
            prompt: actualPrompt,
        })
        imageIDs.push(id);
        // if they have paid too much then refund the difference
        uint excess = msg.value - imageCost;
        if (excess > 0) {
          address payable to = payable(msg.sender);
          to.transfer(excess);
        }
    }

    function getArtists() public view (mapping (string => Artist) storage) {
        return artists;
    }

    function getImageIDs() public view (uint[] storage) {
        return imageIDs;
    }

    function getImage(uint id) public view (StableDiffusionImage storage) {
        return images[id];
    }

    function updateArtist(string id, address wallet, string metadata) public onlyOwner {
        artists[id] = Artist({
          id: id,
          wallet: wallet,
          metadata: metadata
        });
        artistAddresses[wallet] = id;
    }

    function deleteArtist(string id, address wallet, string metadata) public onlyOwner {
        artist = artists[image.artist];
        require(artist.id != "", "ArtistAttribution: artist does not exist");
        require(artist.escrow == 0, "ArtistAttribution: please have the artist withdraw escrow first"); // they have money still to claim
        delete(artistAddresses[artist.wallet]);
        delete(artists[id]);
    }

    function artistWithdraw() public payable {
        artistID = artistAddresses[msg.sender];
        require(artistID != "", "ArtistAttribution: artist does not exist");
        artist = artists[artistID];
        require(artist.escrow > 0, "ArtistAttribution: artist does not have any money to withdraw");
        escrowToSend = artist.escrow;
        artist.escrow = 0;
        address payable to = payable(msg.sender);
        to.transfer(escrowToSend);
    }

    function adminWithdraw(address payable to) public payable onlyOwner {
        computeProviderEscrow = 0;
        to.transfer(computeProviderEscrow);
    }

    function lilypadFulfilled(address _from, uint _jobId, LilypadResultType _resultType, string calldata _result) external override {
        //need some checks here that it a legitimate result
        require(_from == address(bridge)); // TODO: really not secure

        // we onlt care about results types with IPFS CIDs
        require(_resultType == LilypadResultType.CID);

        // get a reference to the image
        image = images[_jobId]

        // sanity check that the image exists with that ID
        require(image.id > 0, "ArtistAttribution: image does not exist");
        // this is important otherwise we are paying out multiple times for the same image
        require(image.isComplete == false, "ArtistAttribution: image already complete");
        require(image.isCancelled == false, "ArtistAttribution: image was cancalled");

        // get a reference to the artist for this image
        artist = artists[image.artist];

        // edge case where we deleted the artist in between the job
        // starting and completing
        require(artist.id != "", "ArtistAttribution: artist does not exist");
        
        // update the result of the image
        image.ipfsResult = _result;
        image.isComplete = true;

        // increase the commission for the artist
        artist.escrow += artistCommission;
        artist.revenue += artistCommission;
        artist.numJobsRun += 1;
        computeProviderEscrow += imageCost - artistCommission;
        computeProviderRevenue += imageCost - artistCommission;

        emit ImageGenerated(image);
    }

    function lilypadCancelled(address _from, uint _jobId, string calldata _errorMsg) external override {
        require(_from == address(bridge)); // TODO: really not secure

        // get a reference to the image
        image = images[_jobId]

        // sanity check that the image exists with that ID
        require(image.id > 0, "ArtistAttribution: image does not exist");
        require(image.isComplete == false, "ArtistAttribution: image already complete");
        require(image.isCancelled == false, "ArtistAttribution: image was cancalled");

        // mark the image as cancelled and refund the customer
        image.isCancelled = true;
        image.customer.transfer(imageCost);

        emit ImageCancelled(image);
    }
}