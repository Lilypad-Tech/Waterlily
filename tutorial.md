## **🎮 Try it!**

Live on FVM at [www.waterlily.ai](http://www.waterlily.ai)

%[https://youtu.be/WD3yrBxunOs] 

# 📌 Quick Links

> Github: [https://github.com/bacalhau-project/Waterlily](https://github.com/bacalhau-project/Waterlily)
> 
> Docs: [https://docs.bacalhau.org](https://docs.bacalhau.org/)

# **👩‍💻 What we'll do...**

In this tutorial I'll take you through how to go about building a similar application to Waterlily.ai on FEVM and Bacalhau, including:

* Building and deploying a solidity smart contract on the Filecoin Virtual Machine
    
* Using Lilypad for bridging FVM with AI functions like StableDiffusion
    
* Building the front-end UI interactions in Typescript
    
* Bonus: Creating an open-source Stable Diffusion model to run on Bacalhau
    
    * Bonus: Finetuning models with Dreambooth
        
    * Bonus: Creating a private Bacalhau cluster to run your scripts and models on
        

Some knowledge of javascript and solidity is assumed in this tutorial.

# 🗺️ Overview

There’s no doubt that AI has reached the mass adoption phase of the technology cycle and is reshaping industries and generating new opportunities across a variety of verticals.

The use of Stable Diffusion models, for generative AI-Art, is no exception with Stability.ai, Midjourney, Dall-E and more making Stable Diffusion models a household name.

These stable diffusion models raise some important social and legal questions though, not least of which is the problematic use of pre-existing images in models without proper attribution, consent, or revenue provided to the original creator.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682315763499/2fc310a4-19d8-4835-9caf-14d64c00f2b6.png align="center")

[Waterlily.ai](http://Waterlily.ai) is a proof-of-concept application aiming to provide an alternative ethical solution by creating a new paradigm for AI image generation that pays royalties to the original creator and offers a new revenue stream for artists to explore.

To achieve this, Waterlily leverages the transparency & trustlessness of blockchain, with [FVM](https://fvm.dev/) smart contracts, combined with a decentralised edge compute platform in [Bacalhau](https://docs.bacalhau.org/examples/) to deliver an intuitive user experience for generative AI-Art while compensating creators for their original work with every image generation call.

Each stable diffusion model on Waterlily is trained & finetuned to a selection of artist work that has been uploaded by the artist themselves or is available in the public domain. When a user navigates to the Waterlily.ai platform, they simply enter a text prompt for the images they want to create and choose an artist style that appeals to them.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682492030319/0d0d1a73-9783-420d-be5c-f6abd7abe6f8.png align="center")

The small fee paid by the user is then distributed to the artist's wallet (except the fees required by the network to run the contract calls & return the generated images) - or to a vetted creator foundation in the case of public images.

A user can then opt to download these generated images or mint them as NFTs.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682476107570/3e5e30f6-f75c-4051-bae5-ee61dbb0c12b.gif align="center")

# 🥞 The Tech Stack

Waterlily relies on two main technology tools -

**FVM** (Filecoin Virtual Machine): the Filecoin EVM-compatible blockchain network to which the smart contracts are deployed and which acts as a payment layer, provides a verifiable record of transactions for art provenance, and hosts any NFTs.

**Bacalhau**: a verifiable peer-to-peer compute layer which both trains new artist models and also runs the stable diffusion scripts that generate images from a user's text prompt.

The image below provides some great context for the Filecoin star map with FVM = Programmable Application and Bacalhau = Computation Services.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1681709912892/44470bb6-51e9-452f-849c-280f3d7ba71d.png align="center")

### Filecoin Virtual Machine (FVM)

The Filecoin Virtual Machine went live on the 14th March this year enabling a new set of potential use cases on Filecoin.

Fun fact: 14 March is 3.14 in American date-time or the first 3 PI digits which also happens to be the network id of the FVM mainnet chain!

![Bacalhau Project Report – March 14, 2023 - by Luke Marsden](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnD0oiFQJhrKsL6o6EFsa_FR33_kR2HRYrDc4uBIKqUBq4HZ7aOBbHO0mbAew9TYK3atk&usqp=CAU align="center")

### Bacalhau

Bacalhau is aiming to help democratise the future of data processing by enabling off-chain computation over data without giving up the decentralisation values inherent to IPFS, Filecoin & Web3 more broadly.

[**Bacalhau**](https://docs.bacalhau.org/) is a peer-to-peer open computation network that provides a platform for public, transparent and optionally verifiable computation processes where users can run Docker containers or Web Assembly images as tasks against *any* data including data stored in IPFS (& soon Filecoin). It even has support for GPU jobs.

Making data processing and computation open and available to everyone & speeding up the processing times is possible in Bacalhau, firstly - by using batch processing across multiple nodes and secondly by putting the processing nodes where the data lives!

![image](https://docs.bacalhau.org/assets/images/architecture-purpose-f192f229e16abe177d77f146ab2dca30.jpeg align="left")

### FVM + Bacalhau = better together

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1681709945041/a95b16ed-8dfb-4491-bbd8-b6671e933111.png align="center")

More on this later ;)

### Tech Tooling Detail

* **Smart Contracts** \[Solidity, Open Zeppelin\]
    
    * [Solidity](https://docs.soliditylang.org/en/v0.8.17/) is an OO smart contract programming language for Ethereum (EVM) -compatible blockchains (used for the contracts)
        
    * [Open Zeppelin](https://docs.openzeppelin.com/contracts/4.x/) offers a security-audited implementation library of common smart contract components and contracts (we use this for the basis of the NFT contract)
        
* **Smart Contract IDE** \[Hardhat, Remix\]
    
    * [Hardhat](https://hardhat.org/docs) is a development environment for editing, compiling, debugging & deploying Ethereum software
        
    * [Remix Ethereum IDE](https://remix.ethereum.org/), is a no-setup tool with an in-browser GUI for developing smart contracts.
        
* **Blockchain Network** \[Filecoin Virtual Machine\]
    
    * The FVM is an EVM-compatible mainnet built on the Filecoin blockchain
        
* **NFT Metadata Storage** \[NFT.Storage\]
    
    * [NFT.Storage](https://nft.storage/) is a public good built on top of IPFS & Filecoin to store NFT Metadata immutably and persistently & offers free decentralised storage for NFTs and a javascript sdk.
        
* **Artist Metadata Storage** \[Web3.Storage\]
    
    * Similar to NFT.Storage, with web3.storage you get all the benefits of decentralized storage and other cutting-edge protocols with the frictionless experience you expect in a modern dev workflow.
        
* **Front-End** \[NextJS / Typescript + NPM\]
    
    * We probably all know these... right? :P
        
* **Smart Contract Interactions** from client \[Metamask, Ethers, Chainstack RPC Node\]
    
    * Using a [public RPC node](https://www.alchemy.com/overviews/rpc-node) - I can get read-only interactions with my blockchain contract.
        
    * With a [Metamask](https://metamask.io/) provider (or similar wallet that [injects the Ethereum API](https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents) specified by [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) into the browser), we enable write calls to the blockchain contract.
        
    * [Ethers](https://docs.ethers.org/v5/)js is a library for interacting with EVM-compatible smart contracts
        
* AI **Text-To-Image Stable Diffusion Script** \[Python, Tensorflow, Docker\]
    
    * [TensorFlow](https://www.tensorflow.org/) is an open-source machine learning platform and library that provides pre-trained models and other data and ML tools.
        
* Decentralised **Off-Chain Compute** for AI Text-To-Image Generation & Model Training \[Bacalhau\]
    
    * [Bacalhau](https://docs.bacalhau.org/) is a peer-to-peer open computation network that provides a platform for public, transparent and optionally verifiable computation processes. It's a decentralised off-chain data computation layer
        

# 🏗️ Building the Smart Contracts for Waterlily.ai

Wooo, pre-amble complete - let's make some code!

### Creating the Smart Contracts on FEVM

The FVM is a fully EVM-compatible network (hence the abbreviation - FEVM). This means that not only do we have access to all of the Filecoin decentralised storage network's [API calls](https://docs.filecoin.io/reference/json-rpc/introduction/) we can also use solidity to write our contracts and take advantage of all the awesome tooling & audited contracts available to us on the EVM network as well.

![The Reality of a Developer's Life Gif](https://dz2cdn1.dzone.com/storage/temp/13990131-code-09.gif align="center")

*Woo-hoo (dev-style) party time 🎉*

This project relies on 2 main contracts:

1. An Artist Contract that can onboard and edit artist data
    
2. An NFT Contract for NFT creation.
    

**The NFT Contract**

Let's start with the NFT Contract, something I've written about before in this guide: [https://developerally.com/build-your-own-ai-generated-art-nft-dapp](https://developerally.com/build-your-own-ai-generated-art-nft-dapp).

When I built the demo application above, my main motivation was to help people learn how to use both FVM and Bacalhau. However, whilst I was making it, I was fairly unsettled by the fact I was using AI to generate art without any real knowledge of where those datasets (ie. the art) used to train the OSS ML model I used, were coming from. This was one of the motivations behind Waterlily.ai.

The NFT contract in this app is actually no different to the one documented above - so feel free to go ahead and peruse the section "Building & Deploying the Solidity NFT Contract" if you'd like to replicate the NFT contract as well. 😎🫘

**The Artist Contract**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
    @notice An experimental contract for POC work to call Bacalhau jobs from FVM smart contracts
*/
contract Waterlily is Ownable {
    //ok now what...
}
```

The Artist Contract requires the following information:

*Data Models*

* An Artist Model (struct) to store data we need to know about an Artist such as their
    
    * payment wallet address
        
    * an identifier for their specific ML model to run when chosen (we've made special use of this id and made it an IPFS CID that contains metadata the artist input when signing up to Waterlily)
        
    * details on their revenue and FIL payments from Waterlily
        
    * some convenience helpers in the form of an id=&gt;Artist mapping and an array for the UI to read from
        

```solidity
struct Artist {
    string id; // A CID containing all metadata about an artist
    address wallet; // Their FEVM wallet address for payments
    uint256 escrow; // amount of FIL owed to an Artist 
    uint256 revenue; // total amt of revenue earned since joining
    uint256 numJobsRun; // total numbner of jobs run on the artist
    bool isTrained; // a flag for if the Artist Model is ready
}
// mapping of artist id onto artist struct
mapping (string => Artist) artists;
// we need this so we can itetate over the artists in the UI
string[] artistIDs;
```

* An Image Model (struct) to store information on the generated images made including
    
    * The image owner
        
    * The original artist the image was generated from
        
    * The prompt input used to generate the image
        
    * A link to the image generated or the status of the image otherwise (ie. if there's an error)
        
    * Convenience helpers: Mappings from customer to images owned by the customer and open Zeppelin Counters contract to generate the Image Id's
        

```solidity
/* ===I mports === */
import "@openzeppelin/contracts/utils/Counters.sol";

/* === Contract vars below === */
using Counters for Counters.Counter; 
Counters.Counter private _jobIds; // the image id - this is technically a Bacalhau job - hence the name _jobIds
    
struct Image {
    uint id; // each image created has a unique id like an NFT
            // we're leveraging OpenZeppelin counter contract to make                                 
            // these id's (see end of code here)
    uint jobId; // the id of the bacalhau job returned from lilypad bridge
    address customer; // the wallet owner for this image
    string artist; // the original artist model id of this image
    string prompt; // the text prompt used to generate the image
    string ipfsResult; // the image result: this is an IPFS CID returned by the script
    string errorMessage; // if error occurred running the job
    bool isComplete; // is the Stable Diffusion job complete?
    bool isCancelled; // if the job was cancelled.
}
    
mapping (uint => Image) images; // mapping of id to the Image
mapping (address => uint[]) customerImages; // a map of customer address onto images they have submitted
```

*Methods* (setters, getters & events) - things we need to interact with the contract

* Artist:
    
    * *getArtistIds()* \* we need to know all the artists in the contract in order for the UI to display them
        
    * *getArtistById()* \* fetch a specific artist
        
    * *artistWithdrawFunds(address payable \_to)* \*onlyArtist function - this function provides a method for the artist to withdraw their earnings at any time. The contract otherwise keeps funds in escrow until an artist has earned 5FIL in order to avoid the gas costs reducing their overall revenue earnings.
        
    * *CreateArtist(string calldata \_ArtistId)* \* Artist Signup is automated. This function is called when a new artist registers on the UI
        
    * *DeleteArtist()* \*ownerOnly function - this is to ensure bad actors uploading illegal or non-IP owned art are able to be removed from the platform
        
    * *UpdateArtistWallet()* \*ownerOnly or artistOnly function - only the artist themselves or the owner of the contract (just in case of a change of public charity address or a verified Artist losing a private key) are able to change the artist wallet address!
        
    * *Events:* Let's also create some events for useful-to-log occurrences on the contract like
        
        * When an artist is added
            
        * When an artist is deleted
            
        * When an artist wallet is updated
            
        * When an artist is paid
            

```solidity
/** The events tracked by the contract *//
event ArtistAdded(string indexed artistId);
event ArtistDeleted(string indexed artistId);
event ArtistWalletUpdated(string indexed artistId, address prevWallet, address curWallet);
event ArtistPaid(string indexed artistId, address _paidTo, uint256 amountPaid);

/** self explanatory XD **/     
function getArtistIds() public view returns (string[] memory) {
   return artistIDs; // we defined this earlier!
}

/** self explanatory XD **/ 
function getArtistById(string calldata _artistId) public view returns (Artist memory) {
   return artists[_artistId]; // we defined this earlier!
}

/**
    @notice This function allows an Artist to withdraw their earnings at any time. Which will be possible to do through the UI in future.
*/
function artistWithdrawFunds(string calldata _artistId) public payable {
   require(bytes(artists[_artistId].id).length > 0, "artist does not exist"); // check that the artistID exists
   Artist storage artist = artists[_artistId];
   require(artist.wallet == msg.sender, "only the artist's wallet can call this function"); // only the artist wallet associated with this artistId can withdraw the funds!
   require(artist.escrow > 0, "artist does not have any money to withdraw"); 
   uint256 escrowToSend = artist.escrow;
   artist.escrow = 0; // No reentrancy issues for us please!
   address payable to = payable(msg.sender);
   to.transfer(escrowToSend);
   emit ArtistPaid(_artistId, to, escrowToSend);
}

/**
    @notice This function is used by the UI. The UI takes in all the artist details from an onboarding form and generates an IPFS CID from their public metadata. It then uses this as the unique artist Id. To disincentivise bad actors, we've also add a small upfront payment to sign on as an artist, which also covers our costs to generate images and update contract details of a new artist. While it's true that anyone could call this function with any string, there is no real value to doing so as no model will be trained nor will it display on the UI. We'll see more on that later!
*/
function createArtist(string calldata _artistId) external payable {
   require(bytes(_artistId).length > 0, "please provide an id");
   require(bytes(artists[_artistId].id).length == 0, "artist already exists");
   require(msg.value >= artistCost, "not enough FIL sent to pay for training artist"); // this is a variable defined in the contract by the admin of the contract & can be changed as needed for gas cost coverage.
   if(bytes(artists[_artistId].id).length == 0) {
        artistIDs.push(_artistId);
    }
   artists[id] = Artist({
        id: _artistId,
        wallet: msg.sender,
        escrow: 0,
        revenue: 0,
        numJobsRun: 0,
        isTrained: false
    });
    emit ArtistAdded(_artistId);
}

/**
    @notice This function takes advantage of Open Zeppelin's Ownable contact to ensure that only the contract deployer can remove an Artist. -> import "@openzeppelin/contracts/access/Ownable.sol";
        -> contract Waterlily is Ownable {}
*/
function deleteArtist(string calldata id) public onlyOwner {
    require(bytes(artists[id].id).length > 0, "artist does not exist");
    Artist storage artist = artists[id];
    require(artist.escrow == 0, "please have the artist withdraw escrow first"); // they have money still to claim
    delete(artists[id]);
        // remove from artistIDs
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

/**
    @notice Example of UpdateArtist function to change an Artist's wallet address. Passing in the artistId helps us find the Artist details
*/
function updateArtistWallet(string calldata _artistId, address _newWalletAddress) public {
    require(bytes(artists[_artistId].id).length > 0, "artist does not exist");
    Artist storage artist = artists[id];
    require(artist.wallet == msg.sender || msg.sender == owner(), "only the artist's wallet can call this function"); //artist or owner
    artist.wallet = _newWalletAddress;
}
```

Hunky dory!!!

Err... wait, what about the generated images?!

Also, side point - hunky dory is a really weird expression... where did it come from even? Was there a particularly handsome Dory fish somewhere? But I digress...

![GIF spongebob squarepants season 9 episode 13 - animated GIF on GIFER](https://i.gifer.com/ReWf.gif align="center")

*These folks look pretty hunky dory...*

* Images!
    
    * *getCustomerImages(address \_ownerAddress)*
        
    * *createImage(string calldata artistId, string calldata \_textPrompt)*
        
    * *Events:* ImageJobCall (wait... what's this name... read on friend!)
        

```solidity
event ImageJobCalled(Image image)

/** Takes the owner address & returns images associated with it **/
function getCustomerImages(address customerAddress) public view returns (uint[] memory) {
    return customerImages[customerAddress];
}

/** Creates a Stable Diffusion image from a text prompt input with the specific Artist ML model... or does it...? **/
function createImage(string calldata _artistId, string calldata _prompt) external payable {
    require(bytes(artists[_artistId].id).length > 0, "Artist does not exist"); // make sure the Artist model exists
    require(artists[_artistId].isTrained, "Artist has not been trained"); // make sure the Artist ML model is trained
    require(msg.value >= imageCost, "Not enough FIL sent to pay for image generation"); // the _imageCost is another variable set by the contract. This is the money the artist will receive (outside of gas fees for returning the image.... more on that soon)

    _imageIds.increment(); // increment the image id aka Bacalhau jobId
    uint id = _imageIds.current();

    // create the details of this new AI-generated image
    images[id] = Image({
        id: id,
        jobId: 0,
        customer: msg.sender,
        artist: _artistId,
        prompt: _prompt,
        ipfsResult: "",
        errorMessage: "",
        isComplete: false,
        isCancelled: false
    });
    customerImages[msg.sender].push(id); // add the image to the customer owned images
    emit ImageJobCalled(images[id]); // emit an event saying the image generation function has been called... 

    // if they have paid too much then refund the difference assuming it's a mistake (a user can always donate to an Artist from the Waterlily UI :) )
    uint excess = msg.value - imageCost;
    if (excess > 0) {
        address payable to = payable(msg.sender);
        to.transfer(excess);
    }
}
```

For the savvy readers out there, you might now be wondering.... but where and how exactly is the image generated? This createImage() function code just creates a data structure type of Image and stores it on the contract - it does nothing to *actually* generate an image... 🤔

Well, this is exactly where Project Lilypad comes in!

### Lilypad - Connecting the FEVM smart contracts to run Stable Diffusion on Bacalhau

[Project Lilypad](https://github.com/bacalhau-project/lilypad) is a 'relayer' or 'bridge' which enables users to call Bacalhau jobs (like stable diffusion) from a smart contract and have the results of the deterministic job returned to their contract.

Quick refresher: Bacalhau is a peer-to-peer network of nodes (including GPU-enabled nodes) that can run any Docker job or WASM image.

> **Very Important Note Here ie. you should probably stop scrolling & read me** 🚩🫶 **!**
> 
> [Lilypad](https://github.com/bacalhau-project/lilypad) is currently in alpha stage - which means that while it's fully functional, there aren't guarantees on reliability or security of the network. It is deployed to the FVM Calibration Network, FVM Hyperspace Testnet and [FVM Mainnet](https://www.fvm.dev) and connects to the public p2p [Bacalhau network](https://www.docs.bacalhau.org).
> 
> The team is currently also working on plans for [Lilypad](https://github.com/bacalhau-project/lilypad) to become much more developer-friendly and expansive, as well as include more comprehensive examples.
> 
> The good news for you early dev's - is it's all currently free to use outside of FVM network gas fees (I like that price!) **and** you can have your say in Lilypad's direction by letting us know what use cases you're interested in our help to enable! #bacalhau-lilypad channel in

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1681878052015/e65133dd-30b3-46c3-948e-b66e365294f2.png align="left")

The way Lilypad works to connect FVM and Bacalhau in practice is (aka show me the code!) :

* A developer implements the Lilypad Interface in their own smart contract
    
    ```solidity
    /** === Lilypad Interface === **/
    pragma solidity >=0.8.4;
    enum LilypadResultType {
      CID,
      StdOut,
      StdErr,
      ExitCode
    }
    
    interface LilypadCallerInterface {
      function lilypadFulfilled(address _from, uint _jobId, LilypadResultType _resultType, string calldata _result) external;
      function lilypadCancelled(address _from, uint _jobId, string calldata _errorMsg) external;
    }
    
    /** === User Contract Example === **/
    contract MyContract is LilypadCallerInterface {
        
        function lilypadFulfilled(address _from, uint _jobId,   
            LilypadResultType _resultType, string calldata _result)        
            external override {
            // Do something when the LilypadEvents contract returns    
            // results successfully
        }
        
        function lilypadCancelled(address _from, uint _jobId, string 
            calldata _errorMsg) external override {
            // Do something if there's an error returned by the
            // LilypadEvents contract
        }
    }
    ```
    
* A developer also needs to call the LilypadEvents 'runLilypadJob()' function from their contract with a valid spec - which corresponds to a Docker Image. 💡 If you want to know more about what a valid image for Bacalhau would look like or see some examples, check out the Bacalhau [docs](https://docs.bacalhau.org) or check out the stable diffusion code example provided in the [Lilypad github](https://github.com/bacalhau-project/lilypad).
    
    ```solidity
    import "./LilypadEvents.sol"; //please check the github for up to date contract, instructions & needed addresses!
    import "./LilypadCallerInterface.sol";
    
    /** === User Contract Example === **/
    contract MyContract is LilypadCallerInterface {
        address payable public lilypadEventsAddress;
        
        constructor (address payable _eventsContractAddress) {
            lilypadEventsAddress = _eventsContractAddress;
        }
    
        function callLilypadEventsToRunBacalhauJob() external payable     {
            // Require at least 0.03 FIL to be sent
            require(msg.value >= 30000000000000000, "Insufficient payment"); //this is the default amount 0.03FIL required to run a job. Check the github docs for more info
             string memory spec = "StableDiffusion";
    
             // Call the function in the other contract and send fee
            (bool success, uint256 jobId) = lilypadBridgeAddress.call{value: lilypadFee}(abi.encodeWithSignature("runLilypadJob(address, bytes, uint256)", address(this), spec, uint256(LilypadResultType.CID)));
            require(success, "Failed to call the lilypad Events function to run the job.");
            //do something with the returned jobId
        }
    }
    ```
    

> 👉 See the [LilypadEvents contract in remix  
> ](https://remix.ethereum.org/bacalhau-project/lilypad/blob/main/hardhat/contracts/LilypadEventsUpgradeable.sol)👉 See the [LilypadCallerInterface in remix](https://remix.ethereum.org/bacalhau-project/lilypad/blob/main/hardhat/contracts/LilypadCallerInterface.sol)

This is all that's needed on the contract side of things to invoke a Bacalhau job to run from your own FEVM smart contract! We just created a decentralised app that isn't just decentralised on-chain, but also uses a decentralised compute service to run an ML model!

![Cool Cat GIF](https://media.tenor.com/9LjKofWMtV4AAAAM/cool-cat.gif align="center")

*^ Totally you right now*

All that needs to happen now is to put the full contract together and deploy it!

**Side note on tutorial vs production codebase:**

The examples above show you how you could build a DApp with similar functionality to Waterlily.ai. In practice, however, Waterlily utilises a private LilypadEvents contract and bridge service (which ensures only compute jobs called from the Waterlily contract are run) and which connects to a private Bacalhau node cluster to run the unique stable diffusion jobs of each artist from the FEVM smart contract. It additionally simplifies the logic needed to handle the individual ML models of the artists. Waterlily.ai was designed this way to ensure we could protect the Artist ML models (which are not publicly owned IP) and ensure that images cannot be generated without payment fees for the original artists. ❤️  
It also provides reliability guarantees on the GPU compute nodes in the Bacalhau cluster which are needed for users creating generative images on the DApp as well as for training new Artist models in their unique styles from supplied examples.

You can skip to the bonus sections below to see more details on creating a private Bacalhau cluster as well as how you might train unique artist models & pass their spec in though! 😉

![The world is your oyster GIFs - Find & Share on GIPHY](https://media1.giphy.com/media/3o6ZsTKgn4FU1YQFsk/giphy.gif align="center")

### **Full Contract**

Below is a full copy of a working solidity contract utilising the Lilypad StableDiffusion spec. (brace yourself - it's a bit lengthy!)

![Brace Yourself GIFs | Tenor](https://media.tenor.com/bkBSIGeb3XQAAAAM/brace-yourself-got.gif align="center")

> 👉 [Click here to open this contract in remix!](https://remix.ethereum.org/bacalhau-project/Waterlily/blob/develop/hardhat/contracts/WaterlilyPublicContractExample.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./LilypadEventsUpgradeable.sol";
import "./LilypadCallerInterface.sol";

error WaterlilyError();

contract Waterlily is LilypadCallerInterface, Ownable {
    /** General Variables */
    address public lilypadBridgeAddress;
    uint256 lilypadFee = 0.03 * 10**18; //default fee
    
    // These are used in order to ensure the lilypad wallet can cover gas fees
    // for returning an image to the contract on FVM mainnet. (no charge on testnet, we auto topup tFIL)
    // The bacalhau network doesn't currently charge for compute use.
    uint256 public computeProviderEscrow;
    uint256 public computeProviderRevenue;

    uint256 public imageCost = 0.13 * 10**18; 
    
    uint256 public artistCommission = 0.1 * 10**18;
    uint256 public artistCost = 0.1 * 10**18;
    uint256 public artistAutoPaymentMin = 3 * 10**18;


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
    Counters.Counter private _imageIds;
   
    struct Image {
        uint id;
        uint jobId; //the returned id for a job run by Lilypad.
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
    constructor(address _lilypadEventsContractAddress){
        lilypadBridgeAddress = _lilypadEventsContractAddress;
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
        // though it is possible to do with lilypad
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

        _imageIds.increment();
        uint id = _imageIds.current();

    /** This is where we call the lilypad bridging contract */
        /** NOTE: In reality each of your artists would need a different bacalhau job spec as each artist uses a unique model to generate images in their specific style. Note the "Image" provided - a generic stable diffusion job **/
    string constant specStart = '{'
        '"Engine": "docker",'
        '"Verifier": "noop",'
        '"Publisher": "estuary",'
        '"Docker": {'
        '"Image": "ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1",'
        '"Entrypoint": ["python", "main.py", "--o", "./outputs", "--p", "';

    string constant specEnd =
        '"]},'
        '"Resources": {"GPU": "1"},'
        '"Outputs": [{"Name": "outputs", "Path": "/outputs"}],'
        '"Deal": {"Concurrency": 1}'
        '}';

        //How the spec is managed to add the prompt is a little awkward atm, but alpha's always improve :)
        string memory spec = string.concat(specStart, _prompt, specEnd);

        // Cast enum value to uint8 before passing as argument (yes this is DX we want to fix :P)
        uint8 resultType = uint8(LilypadResultType.CID);

         // Call the function in the other contract and send funds
        (bool success, bytes memory result) = lilypadBridgeAddress.call{value: lilypadFee}(abi.encodeWithSignature("runLilypadJob(address, string, uint8)", address(this), _spec, resultType));
        require(success, "Failed to call the lilypad Events function to run the job.");
        uint jobId;
        assembly {
            jobId := mload(add(result, 32))
        }

        images[id] = Image({
            id: id,
            jobId: jobId,
            customer: msg.sender,
            artist: _artistId,
            prompt: _prompt,
            ipfsResult: "",
            errorMessage: "",
            isComplete: false,
            isCancelled: false
        });

        customerImages[msg.sender].push(id);

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
```

You might notice that there's a few extra pieces in this contract we haven't so far discussed including:

* *Paying Artist in LilypadFulfilled:* This code pays out the artist when their escrow hits a specific amount. A technical decision was made against instant payments here so as to avoid the artist losing too much to gas fees. In future iterations though, micropayments could be enabled via an awesome project on the FVM mainnet called [State Channels](http://docs.statechannels.org).
    
* In practice, you'd also likely want to enable a way to update the global variables of lilypadBridgeAddress, lilypadFee, imageCost, artistCommission, artistCost and artistAutoPaymentMin.
    

I will additionally note that it might be advantageous to also make this contract upgradeable with OpenZeppelin's great guide to upgradeable contracts [here](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#modifying-your-contracts) and you could also take advantage of the [OpenZeppelin PaymentSplitter contract](https://docs.openzeppelin.com/contracts/4.x/api/finance#PaymentSplitter) for artist payments rather than handle this manually 😎

## Deploying the (Complete) Smart Contracts to FVM

Right, we have a contract! Let's deploy this to the FVM!

### **FVM Network details**

See [https://docs.filecoin.io/networks](https://docs.filecoin.io/networks)  
See also [chainlist.org](https://chainlist.org/?search=Filecoin&testnets=true)

| Chain Name | RPC | ChainID | BlockExplorer | Faucet |
| --- | --- | --- | --- | --- |
| Filecoin Calibration Net (**testnet**) | [https://api.calibration.node.glif.io/rpc/v0](https://api.calibration.node.glif.io/rpc/v0) | 314159 | [https://calibration.filscan.io/](https://calibration.filscan.io/), | [https://faucet.calibration.fildev.network/](https://faucet.calibration.fildev.network/) |
| Filecoin Hyperspace (**testnet**) | [https://api.hyperspace.node.glif.io/rpc/v1](https://api.hyperspace.node.glif.io/rpc/v1), [https://hyperspace.filfox.info/rpc/v1](https://hyperspace.filfox.info/rpc/v1), [https://filecoin-hyperspace.chainstacklabs.com/rpc/v1](https://filecoin-hyperspace.chainstacklabs.com/rpc/v1), [https://rpc.ankr.com/filecoin\_testnet](https://rpc.ankr.com/filecoin_testnet) | 3141 | [https://fvm.starboard.ventures/hyperspace/explorer/tx/](https://fvm.starboard.ventures/hyperspace/explorer/tx/), [https://explorer.glif.io/](https://explorer.glif.io/), | [https://hyperspace.yoga/#faucet](https://hyperspace.yoga/#faucet) |
| Filecoin Mainnet | [https://api.node.glif.io/rpc/v1](https://api.node.glif.io/rpc/v1), [https://filecoin-mainnet.chainstacklabs.com/rpc/v1](https://filecoin-mainnet.chainstacklabs.com/rpc/v1), [https://rpc.ankr.com/filecoin](https://rpc.ankr.com/filecoin) | 314 | [https://fvm.starboard.ventures/](https://fvm.starboard.ventures/), [https://explorer.glif.io/](https://explorer.glif.io/), [https://beryx.zondax.ch/](https://beryx.zondax.ch/), [https://filfox.io/](https://filfox.io/) |  |

There's quite a few ways to go about deploying this contract - I'll go through deployment on both remix (available in your browser) and utilising [Hardhat](https://hardhat.org/) - an Ethereum developer environment tool.

**Pre-requisites:**

To deploy to a Filecoin network, we'll need to

1. [**Set up & connect**](https://docs.filecoin.io/developers/smart-contracts/how-tos/add-to-metamask/) [Metamask](https://metamask.io/) wallet (you can use other compatible wallets, though I'll be using Metamask here)
    
2. Obtain funds for deployment (if on testnet, you can use the faucets, otherwise see [this guide](https://docs.filecoin.io/basics/assets/transfer-fil/))
    

To add the network you're deploying to in the wallet, you can either look it up on [chainlist.org](https://chainlist.org/?search=Filecoin&testnets=true) and add it via their interface, or you can add it manually.  
To manually add it, navigate to your Metamask wallet and click "Add network" button

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682304141584/4e262a9d-1b12-43e3-9769-5609c36c02b3.png align="left")

Fill out the following details and then click 'Save"

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682304039986/36e9a229-528f-4270-8395-632fd89e2065.png align="left")

If you're deploying to a testnet, you'll need to use the faucet to add funds to your wallet - see the above chart for the faucet links. Note the Calibration Net faucet requires a filecoin type address - which you can find by connecting your metamask wallet at [https://www.glif.io/](https://www.glif.io/).

If you're using mainnet, you can add funds via your ledger or from an exchange. See [this guide](https://docs.filecoin.io/basics/assets/transfer-fil/) for more info.

### **Deploy on Remix**

It's fairly simple to deploy to FVM in remix using Metamask Wallet. To do so open the contract by clicking 👉 [open in remix!](https://remix.ethereum.org/bacalhau-project/Waterlily/blob/develop/hardhat/contracts/WaterlilyPublicContractExample.sol)

You'll also need the Lilypad contracts, so go ahead and copy them into your open remix browser window too (you can find them [here](https://github.com/bacalhau-project/lilypad/tree/main/hardhat/contracts) - we're working on npm imports!).

Once you have the 2 contracts and the LilypadCallerInterface in remix, make sure your metamask wallet is connected to your desired network and you have funds in your wallet.

Go to the compiler tab (solidity icon) and click compile

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682316846199/078b6214-adbd-4fd5-9958-547af1915daf.png align="center")

Then go to the Ethereum tab (Ethereum icon) and choose "Injected Provider - Metamask" - this will link to your current Metamask network and wallet settings.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682317298848/89c4150a-6628-4baa-9960-2afcfd3beeff.png align="center")

Then you can deploy this using the big orange Deploy button on the left and passing in the LilypadEvents contract address (for the network you're deploying to) as a constructor argument. Metamask will ask you to approve the deployment transaction & fee.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682318558426/4387cc9f-2468-4eb0-8dc8-d550df26a080.png align="center")

On confirming, the contract will be deployed to your connected network. You can look it up in a block explorer or play around with it in remix (bottom left):

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682318719786/06391efd-32d3-469a-b3d3-2ff0b6ab0c8e.png align="center")

> ⚠️ Don't forget to save the address for use in our front end!! ⚠️

### **Deploy on Hardhat**

[**Hardhat**](https://hardhat.org/docs) is a development environment for editing, compiling, debugging & deploying Ethereum software. As the FVM is EVM-compatible we can take advantage of this tool

Hardhat also provides the benefit of enabling a local chain as well as a testing suite.

To set up a hardhat project see their [docs here](https://hardhat.org/hardhat-runner/docs/getting-started) - they even have an extension for VS code editors.

> Note: Hardhat for typescript requires some specific tsconfig options, that don't always play well with NextJs tsconfig needs. So if you're looking to have hardhat nested inside your front-end directory, you'll be giving yourself some setup challenges.

The wallet private key, needed in the config for hardhat is available via Metamask -&gt; account details -&gt; export private key, and is here stored in a .env variable.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682470066433/49da1d73-075c-48f8-8a8c-cf46025bce24.png align="center")

*hardhat.config.ts*

```typescript
import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || './.env';
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const walletPrivateKey: string | undefined = process.env.WALLET_PRIVATE_KEY;
if (!walletPrivateKey) {
  throw new Error('Please set your Wallet private key in a .env file');
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'hardhat',
  namedAccounts: {
    admin: 0,
  },
  networks: {
    hardhat: {},
    localhost: {},
    filecoinHyperspace: {
      url: 'https://api.hyperspace.node.glif.io/rpc/v1', //'https://rpc.ankr.com/filecoin_testnet', //https://filecoin-hyperspace.chainstacklabs.com/rpc/v1, "https://hyperspace.filfox.info/rpc/v1", wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1
      chainId: 3141,
      accounts: [walletPrivateKey],
    },
    filecoinCalibrationNet: {
      url: 'https://api.calibration.node.glif.io/rpc/v0',
      chainId: 314159,
      accounts: [walletPrivateKey],
    },
    filecoinMainnet: {
      url: 'https://api.node.glif.io', //'https://rpc.ankr.com/filecoin_testnet', //https://filecoin-hyperspace.chainstacklabs.com/rpc/v1
      chainId: 314,
      accounts: [walletPrivateKey],
    },
  },
};

export default config;
```

Now let's use a script to deploy Waterlily.sol!

*scripts/deploy.ts*

```typescript
import hre, { ethers } from 'hardhat';

import type { Waterlily } from '../typechain-types/contracts/Waterlily';
import type { Waterlily__factory } from '../typechain-types/factories/contracts/Waterlily__factory';

async function main() {
    const walletPrivateKey: string | undefined = process.env.WALLET_PRIVATE_KEY;
    if (!walletPrivateKey) {
      throw new Error('Please set your Wallet private key in a .env file');
    }

  const owner = new ethers.Wallet(
    walletPrivateKey,
    hre.ethers.provider
  );

  console.log('Waterlily deploying from account: ', owner);
  console.log("Account balance:", (await owner.getBalance()).toString());

  let LILYPAD_ADDRESS;
  if(hre.network.name == 'filecoinHyperspace') {
    LILYPAD_ADDRESS = "", //define me
  }
  if(hre.network.name == 'filecoinCalibrationNet') {
    LILYPAD_ADDRESS = "", //define me
  }
  if(hre.network.name == 'filecoinMainnet') {
    LILYPAD_ADDRESS = "", //define me
  }

  const WaterlilyFactory: Waterlily__factory = <Waterlily__factory>await ethers.getContractFactory('Waterlily')

  const waterlilyContract: Waterlily = <Waterlily>await WaterlilyFactory.connect(owner).deploy(
    LILYPAD_ADDRESS
  )
  await waterlilyContract.deployed()

  console.log('Waterlily deployed to ', waterlilyContract.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
```

You can run this script using the following in the command line of your project

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

The contract address will show on successful deployment.

> ⚠️ Don't forget to save the address for use in our front end!! ⚠️

## **Celebrate!**

You just deployed your contracts to FVM!

![Dancing Unicorn GIFs | Tenor](https://media.tenor.com/MvvXjGVrnMQAAAAC/dancing-unicorn-unicorn.gif align="center")

# 📺 Building the User Interface

The UI, or front-end is built on React (NextJS) and Typescript. To build the front end, I'm using NextJS and Typescript. Though, while I use NextJS's routing, I'm not taking advantage of any of NextJS's SSR (server side rendering) features, so you could really just go with a vanilla React set up (or any framework of your choice of course!).

## UI Overview

The UI currently consists of two pages built on NextJS and Typescript. The main page is the home page. This is where a user is able to generate new images from a prompt input and browse through artist profiles to decide on a style for the generative art. It is also the page that shows a user's collection of previously generated images and NFTS

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1682493487140/491dc60e-941e-49e1-ac39-8569b67c56dc.png align="center")

The second page is the Artist Signup form for new artists to join the platform.

## UI Contract Connections

There are 3 types of contract interactions here

* read-only calls to retrieve data from the chain without mutating it
    
* write calls that require a wallet to sign and pay gas ie. functions that change the state of the chain, like generating a new image, adding an artist or minting an NFT!
    
* event listeners - that listen for events emitted from the contract
    

For all of these functions, we'll use the [**ethers.js library**](https://docs.ethers.org/v5/) - a lightweight wrapper for the Ethereum API, to connect to our contract and perform calls to it.

**Connecting to the contract in read mode with a public RPC:**

```typescript
//The compiled contract found in hardhat/artifacts/contracts  
import WaterlilyCompiledContract from '@Contracts/Waterlily.sol/Waterlily.json';
//On-chain address of the contract
const contractAddress = '<address here>'; 
//A public RPC Endpoint (see table from contract section)
const rpc = '<chain rpc http';

const provider = new ethers.providers.JsonRpcProvider(rpc);
const connectedReadWaterlilyContract = new ethers.Contract(
      contractAddress,
      WaterlilyCompiledContract.abi,
      provider
    );
```

Fetching data from the contract is a read event, so we can use the above to fetch the artist details or fetch the previously generated images belonging to a user's wallet

```typescript
const imageIDs = await connectedReadWaterlilydContract?.getCustomerImages(customerWallet);
```

Listening for events on the contract is also a read-only (get) event, we can use the public RPC to listen for event emissions on-chain.

```typescript
//use the read-only connected Bacalhau Contract
connectedReadWaterlilyContract.on(
    // Listen for the specific event we made in our contract
    'ImageComplete',
    (Image: image) => {
        //DO STUFF WHEN AN IMAGEEVENT COMES IN
        // eg. filter if it is this user's and reload generated imagese-display or
        //
    }
);
```

**Connecting to the contract in write mode** - this requires that the Ethereum object is being injected into the web browser by a wallet so that a user can sign for a transaction and pay for gas - which is why we're checking for a window.ethereum object.

```typescript
//Typescript needs to know window is an object with potentially and ethereum value. 
declare let window: any;
//The compiled contract found in hardhat/artifacts/contracts  
import WaterlilyCompiledContract from '@Contracts/Waterlily.sol/Waterlily.json';
//On-chain address of the contract
const contractAddress = '<address here>'; 

//check for the ethereum object
if (!window.ethereum) {
    //ask user to install a wallet or connect
    //abort this
}
// else there's a wallet provider
else {
// same function - different provider - this one has a signer - the user's connected wallet address
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const contract = new ethers.Contract(
      contractAddress,
      WaterlilyCompiledContract.abi,
      provider
    );
   const signer = provider.getSigner();
   const connectedWriteWaterlilyContract = contract.connect(signer);
}
```

Calling the CreateImage() function in the Waterlily contract with a value of $imageCost:

```typescript
  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    try {
      console.log('Calling stable diffusion function in Waterlily contract...');
      const tx = await connectedWriteWaterlilyContract.CreateImage(artistid, prompt, { value: imageCost }); //wait for netowrk to include tx in a block
      const receipt = await tx.wait(); //wait for transaction to be run and return a receipt
    } catch (error: any) {
      console.error(error);
    }
}
```

Calling the minting function for the NFT contract is also described in [this blog](https://developerally.com/build-your-own-ai-generated-art-nft-dapp).

## UI Wallet Connections

Here are a few helpful wallet functions you might want, including how to check the chainId or wallet balance, and how to programmatically add a network to Metamask / wallet.  
You can interact with wallets using the Metamask Ethereum object directly -as I'm doing below or by using ethers.js or web3.js.

```typescript
declare let window: any;

const fetchWalletAccounts = async () => {
  console.log('Fetching wallet accounts...');
  await window.ethereum //use ethers?
    .request({ method: 'eth_requestAccounts' })
    .then((accounts: string[]) => {
      return accounts;
    })
    .catch((error: any) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    });
};

const fetchChainId = async () => {
  console.log('Fetching chainId...');
  await window.ethereum
    .request({ method: 'eth_chainId' })
    .then((chainId: string[]) => {
      return chainId;
    })
    .catch((error: any) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    });
};

const fetchWalletBalance = async (
    account: string
  ): Promise<any> => {
    let balanceNumber: number;
    try {
        const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account],
          });
        const formattedBalance = ethers.utils.formatEther(balance);
        balanceNumber = parseFloat(formattedBalance);    
    } catch (error) {
      console.error('error getting balance', error);
    }
}

//!! This function checks for a wallet connection WITHOUT being intrusive to to the user or opening their wallet
export const checkForWalletConnection = async () => {
  if (window.ethereum) {
    console.log('Checking for Wallet Connection...');
    await window.ethereum
      .request({ method: 'eth_accounts' })
      .then(async (accounts: String[]) => {
        console.log('Connected to wallet...');
        // Found a user wallet
        return true;
      })
      .catch((err: Error) => {
        console.log('Error fetching wallet', err);
        return false;
      });
  } else {
    //Handle no wallet connection 
    return false;
  }
};

//Subscribe to changes on a user's wallet
export const setWalletListeners = () => {
  console.log('Setting up wallet event listeners...');
  if (window.ethereum) {
    // subscribe to provider events compatible with EIP-1193 standard.
    window.ethereum.on('accountsChanged', (accounts: any) => {
      //logic to check if disconnected accounts[] is empty
      if (accounts.length < 1) {
        //handle the locked wallet case
      }
      if (userWallet.accounts[0] !== accounts[0]) {
        //user has changed address
      }
    });

    // Subscribe to chainId change
    window.ethereum.on('chainChanged', () => {
      // handle changed chain case
    });

    // Subscribe to chainId change
    window.ethereum.on('balanceChanged', () => {
      // handle changed balance case
    });
  } else { 
        //handle the no wallet case
    }
};

export const changeWalletChain = async (newChainId: string) => {
  console.log('Changing wallet chain...');
  const provider = window.ethereum;
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newChainId }], //newChainId
    });
  } catch (error: any) {
    alert(error.message);
  }
};

//AddChain Example
export const addWalletNetwork = async () => {
  console.log('Adding the Hyperspace Network to Wallet...');
  if (window.ethereum) {
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '',
            rpcUrls: [
              'https://',
              'https://',
            ],
            chainName: 'Filecoin ...',
            nativeCurrency: {
              name: 'tFIL',
              symbol: 'tFIL',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://fvm.starboard.ventures/contracts/',
              'https://hyperspace.filscan.io/',
            ],
          },
        ],
      })
      .then((res: XMLHttpRequestResponseType) => {
        console.log('added new network successfully', res);
      })
      .catch((err: ErrorEvent) => {
        console.error('Error adding new network', err);
      });
  }
};
```

# 💫 Bonus Code Section

## Bonus: Creating & Training the Artist ML Models

I've previously written about how to create your own open source Stable Diffusion script here and run it on Bacalhau [here](https://developerally.com/build-your-own-ai-generated-art-nft-dapp).

%[https://www.youtube.com/watch?v=53uY48e1lis&t=1454s] 

Underlying the finetuning is [Dreambooth](https://arxiv.org/abs/2208.12242), which makes stable diffusion even more powerful with the ability to generate realistic looking pictures of humans, animals or any other object by just training them on 20-30 images.

The specific models used for Waterlily, however, were created by [Richard Blythman](https://twitter.com/richardblythman) from [Algovera](https://twitter.com/AlgoveraAI) (he does some awesome work - check him and the team out!).

There's a great guide on how you could get started making scripts like this in the Bacalhau docs on this [here](https://docs.bacalhau.org/examples/model-training/Stable-Diffusion-Dreambooth/).

Check the following repo's out for more inspiration:

* Training and inference of images: [https://github.com/JoePenna/Dreambooth-Stable-Diffusion](https://github.com/JoePenna/Dreambooth-Stable-Diffusion)
    
* Preparation of regularisation images: [https://github.com/aitrepreneur/SD-Regularization-Images-Style-Dreambooth](https://github.com/aitrepreneur/SD-Regularization-Images-Style-Dreambooth)
    

## Bonus: Creating a Private Bacalhau Node Cluster

A private cluster is a network of Bacalhau nodes completely isolated from any public node. That means you can safely process private jobs and data on your cloud or on-prem hosts.  
To create your own private Bacalhau node cluster - you can follow the guide [here](https://docs.bacalhau.org/quick-start-pvt-cluster).

![Magic GIFs | Tenor](https://media.tenor.com/wn2_Qq6flogAAAAM/magical-magic.gif align="center")

# **🌟 Possibilities for AI & Blockchain**

The main power of this POC application lies in its open-source tech stack and in combining the capability of decentralised and verifiable ML & AI with Blockchain payments and traceability.

For me, the current AI trajectory just makes me more sure that blockchain is going to be an absolutely essential and powerful tool for the future - with its ability to provide both a settlement layer for payments as well as verifiable provenance of items on an immutable ledger.

Proving for truth, authenticity and provenance of data and content are going to be essential in an AI-world. This applies not just to art content, but to any content being released, be it Tay Tay's new music album, or, more seriously, news content, scientific research papers and more.

%[https://twitter.com/rpnickson/status/1639813074176679938?s=20] 

Waterlily is aiming to provide a new revenue stream for original creators and perhaps tackle some of the current issues with AI-Art generation. It could also serve as a thought experiment for how we go about both tokenising and training datasets in fully decentralised ways that continues to give individuals authority over their own data.

# 🗺️ Roadmap

Waterlily.ai is an open source repository. We welcome input via the github or submissions of ideas and feedback. Tell us what you think! Tell us what you think should happen next, or help us fix the 🐛🪲🐞 's

If you're an artist, we'd also love to hear from you! Please get in touch :)

# ✍️ Keep in touch!

Congrats if you read all the way through!!!

> A big thank you to the team that helped me develop and deploy Waterlily & Lilypad - including [Luke Marsden](https://twitter.com/lmarsden), [Kai Davenport](https://twitter.com/kai_davenport), [@Wes Floyd](https://twitter.com/weswfloyd), [Simon Worthington](https://twitter.com/51M0NW), [Richard Blythman](https://twitter.com/richardblythman) from [Algovera](https://twitter.com/AlgoveraAI) and the rest of the [Bacalhau](https://twitter.com/BacalhauProject) crew - without whom this app would not have been possible.
> 
> ![Thank You Hug GIF - Thank You Hug Thanks - Discover & Share GIFs](https://media.tenor.com/BT4-2zX_v8sAAAAC/thank-you-hug.gif align="center")

  
  
Keep in touch with us!

* [Filecoin Project Slack](https://filecoinproject.slack.com/) #bacalhau
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1674791065491/9f66f9b5-858f-4db6-8ed7-83ffd0c63c80.png align="center")

With ♥️ [DeveloperAlly](https://twitter.com/DeveloperAlly)
