import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import bluebird from 'bluebird';
/* contract tools */
declare let window: any;
import { ethers, BigNumber } from 'ethers';
const ipfsHttpGatewayLink = `https://nftstorage.link/ipfs/`;

/* Other Contexts */
import {
  StatusContext,
  defaultStatusState,
  ImageContext,
  IMAGE_COUNT,
  WalletContext,
  NetworkContext,
  defaultWalletState,
  NFTJson,
} from '.';

// /* Contracts */
// import {
//   WATERLILY_CONTRACT_ADDRESS,
//   LILYPAD_CONTRACT_ADDRESS,
// } from '@/definitions';

import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
import WaterlilyNFTABI from '../abi/WaterlilyNFT.sol/WaterlilyNFT.json';

import { getAPIServer } from '../definitions/network';

/* ContractContext */
enum AccessType {
  Read = 'read',
  Write = 'write',
}

export interface ContractState {
  mode: AccessType;
  provider: ethers.providers.Provider | null;
  signer: ethers.Signer | null;
  connectedWaterlilyContract: ethers.Contract | null;
  connectedWaterlilyNFTContract: ethers.Contract | null;
}

interface ContractContextValue {
  contractState?: ContractState;
  setContractState: Dispatch<SetStateAction<ContractState>>;
  customerImages: any[];
  nftImages: NFTJson[];
  artistCost: BigNumber;
  imageCost: BigNumber;
  runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
  registerArtistWithContract: (artistId: string) => Promise<string>;
  submitArtistFormToAPI: (
    artistid: string,
    data: any,
    images: File[],
    avatar: File[],
    thumbnails: File[]
  ) => Promise<void>;
  mintNFT: (image: { link: string; alt: string }) => Promise<void>;
}

// const pr = new ethers.providers.JsonRpcProvider(network.rpc[0]);
export const defaultContractState = {
  contractState: {
    mode: AccessType.Read,
    provider: null,
    signer: null,
    connectedWaterlilyContract: null,
    connectedWaterlilyNFTContract: null,
  },
  customerImages: [],
  nftImages: [] as NFTJson[],
  artistCost: BigNumber.from(0),
  imageCost: BigNumber.from(0),
  setContractState: () => {},
  runStableDiffusionJob: async () => {},
  registerArtistWithContract: async () => {
    return '';
  },
  submitArtistFormToAPI: async () => {},
  mintNFT: async () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ContractContext =
  createContext<ContractContextValue>(defaultContractState);

export const ContractContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const { network } = useContext(NetworkContext);
  const readProvider = new ethers.providers.JsonRpcProvider(network.rpc[0]);

  const [contractState, setContractState] = useState<ContractState>({
    mode: AccessType.Read,
    provider: readProvider,
    signer: null,
    connectedWaterlilyContract: new ethers.Contract(
      network.contracts.WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      readProvider
    ),
    connectedWaterlilyNFTContract: new ethers.Contract(
      network.contracts.WATERLILY_NFT_CONTRACT_ADDRESS,
      WaterlilyNFTABI.abi,
      readProvider
    ),
  });
  const [customerImages, setCustomerImages] = useState<any[]>([]);
  const [nftImages, setNftImages] = useState<NFTJson[]>([] as NFTJson[]);
  const [artistCost, setArtistCost] = useState(BigNumber.from(0));
  const [imageCost, setImageCost] = useState(BigNumber.from(0));
  const {
    statusState = defaultStatusState.statusState,
    setStatusState,
    setSnackbar,
  } = useContext(StatusContext);
  const { setImageID, quickImages, saveToNFTStorage } =
    useContext(ImageContext);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (!walletState?.isConnected || walletState.accounts.length <= 0) return;
    //hack to get user images faster than contract returns them
    // const connectedContract = getWaterlilyWriteContractConnection();
    const connectedContract = contractState.connectedWaterlilyContract;
    fetchNFTImagesByOwner();
    console.log('checking for customer images effect...', connectedContract);
    console.log('using provider', contractState.provider);
    //Bug in contract - should not be public (then needs to be a write contract)
    const doAsync = async () => {
      const imageIDs = await connectedContract?.getCustomerImages(
        walletState.accounts[0]
      );

      const imageCost = await connectedContract?.getImageCost();
      const artistCost = await connectedContract?.getArtistCost();
      if (!imageIDs) return;
      console.log('Fetched imageIDs', imageIDs);
      const images = await bluebird.map(imageIDs, async (id: any) => {
        const image = await connectedContract?.getImage(id);
        return image;
      });
      console.log('fetched Images');
      setCustomerImages(images);
      setArtistCost(artistCost);
      setImageCost(imageCost);
    };

    doAsync();
  }, [walletState]);

  useEffect(() => {
    if (quickImages?.length >= IMAGE_COUNT) {
      setSnackbar({
        type: 'success',
        open: true,
        message: `Images have been generated - finalizing transaction...`,
      });
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '',
        isMessage: true,
        message: {
          title: `Receipt: ${txHash}`,
          description: (
            <a
              href={`${network.blockExplorer[0]}${txHash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Status in block explorer
            </a>
          ), //receipt.transactionHash
        },
      }));
    }
  }, [quickImages]);

  //otherwise use default.
  const getWaterlilyWriteContractConnection = () => {
    if (!window.ethereum || !walletState?.accounts[0]) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      network.contracts.WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    );
  };

  const getWaterlilyNFTWriteContractConnection = () => {
    if (!window.ethereum || !walletState?.accounts[0]) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      network.contracts.WATERLILY_NFT_CONTRACT_ADDRESS,
      WaterlilyNFTABI.abi,
      signer
    );
  };

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    if (!window.ethereum) {
      setStatusState({
        ...statusState,
        isError: 'Web3 not available',
        isMessage: true,
        message: {
          title: 'Web3 not available',
          description:
            'Please install and unlock a Web3 provider in your browser to use this application.',
        },
      });
      return;
    }

    console.log('Starting Stable Diffusion Job');
    setStatusState({
      ...defaultStatusState.statusState,
      isLoading: 'Submitting your Waterlily prompts to the FVM network ...',
      isMessage: true,
      message: {
        title: 'Waiting for user to confirm wallet payment',
        description: 'Please check your wallet activity!',
      },
    });

    console.log('fetching contract connections...');
    const connectedContract = getWaterlilyWriteContractConnection();
    console.log('Connected to waterlily contract');

    if (!connectedContract) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'Something went wrong connecting to contract',
      });
      return;
    }

    const imageCost = await connectedContract.getImageCost();

    try {
      console.log('Calling stable diffusion function...');
      const tx = await connectedContract.CreateImage(artistid, prompt, {
        value: imageCost,
      });
      console.log('Got the tx hash', tx.hash); // Print the transaction hash
      setTxHash(tx.hash);

      setStatusState((prevState) => ({
        ...prevState,
        isLoading:
          'Waiting for transaction to be included in a block on the network...',
        isMessage: true,
        message: {
          title: `This could take some time... please be patient while the transaction is included in a block!`,
          description: (
            <a
              href={`${network.blockExplorer}${tx.hash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Transaction Status in block explorer here
            </a>
          ),
        },
      }));
      setSnackbar({
        type: 'success',
        open: true,
        message: `Transaction submitted to the FVM network: ${tx.hash}...`,
      });
      const receipt = await tx.wait();
      console.log('----------TX INCLUDED IN BLOCK------------');
      console.log(JSON.stringify(receipt, null, 4));
      console.dir('Receipt:', receipt);

      const [jobEvent] = receipt.logs.map((log: any) =>
        connectedContract.interface.parseLog(log)
      );
      const [job] = jobEvent.args;
      const [imageID] = job;
      console.dir('Image ID:', imageID.toNumber());

      //poll for events

      setSnackbar({
        type: 'success',
        open: true,
        message: `Transaction included in block - creating images...!`,
      });
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: 'Generating your unique images on Bacalhau...!',
        isMessage: true,
        message: {
          title: `Please be patient... This takes 1-2 minutes depending on demand.`,
          description: (
            <a
              href={`${network.blockExplorer}${tx.hash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Transaction in block explorer
            </a>
          ), //receipt.transactionHash
        },
      }));

      setImageID(imageID.toNumber()); //(56); // //45;
      console.log(
        'Starting to poll for images with imageID:',
        imageID.toString()
      );

      // The below code was never completing :(
      // Though really this is how it should receive images back (events)

      /*let isComplete = false;
      let isCancelled = false;

      const checkJob = async () => {
        const job = await connectedContract.getImage(imageID);
        console.log(
          `checking job: complete: ${job.isComplete}, cancelled: ${job.isCancelled}`
        );
        if (job.isComplete) {
          isComplete = true;
        } else if (job.isCancelled) {
          isCancelled = true;
        }
      };

      while (!isComplete && !isCancelled) {
        await checkJob();
        if (isComplete || isCancelled) break;
        await bluebird.delay(1000);
      }

      if (isComplete) {
        setStatusState((prevState) => ({
          ...prevState,
          isLoading: '',
          isMessage: true,
          message: {
            title: 'Successfully ran WaterLily Stable Diffusion Job',
            description: 'Images: ...',
          },
        }));
        setSnackbar({
          type: 'success',
          open: true,
          message: 'Successfully ran WaterLily Stable Diffusion Job',
        });
      } else if (isCancelled) {
        setStatusState((prevState) => ({
          ...prevState,
          isLoading: '',
          isError: 'Error Running Bacalhau Job',
          isMessage: true,
          message: {
            title: 'Error Running Bacalhau Job',
            description: 'Check logs for more info',
          },
        }));
        setSnackbar({
          type: 'error',
          open: true,
          message: 'Error Running Bacalhau Job',
        });
      } */
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.toString();
      if (error?.error?.data?.message.includes('revert reason:')) {
        const match = error.error.data.message.match(
          /revert reason: Error\((.*?)\)/
        );
        errorMessage = match[1];
      }
      if (errorMessage.length > 64) {
        errorMessage = errorMessage.substring(0, 64) + '...';
      }
      setSnackbar({
        type: 'error',
        open: true,
        message: errorMessage,
      });
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '',
        isError: true,
        message: {
          title: errorMessage,
          description: <span>{errorMessage}</span>,
        },
      }));
    }
  };

  const registerArtistWithContract = async (artistid: string) => {
    if (!window.ethereum) {
      setStatusState({
        ...statusState,
        isError: 'Web3 not available',
        isMessage: true,
        message: {
          title: 'Web3 not available',
          description:
            'Please install and unlock a Web3 provider in your browser to use this application.',
        },
      });
      return '';
    }

    setStatusState({
      ...defaultStatusState.statusState,
      isLoading:
        'Submitting your Artist Information to the Smart Contract on the FVM network ...',
      isMessage: true,
      message: {
        title: 'Waiting for user to confirm wallet payment',
        description: 'Please check your wallet activity!',
      },
    });

    const connectedContract = getWaterlilyWriteContractConnection();
    console.log('Connected to waterlily contract');

    if (!connectedContract) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'Something went wrong connecting to contract',
      });
      return '';
    }

    const artistCost = await connectedContract.getArtistCost();
    console.log('Couldnt fetch artist cost');
    if (!artistCost) return '';

    try {
      const tx = await connectedContract.CreateArtist(artistid, '', {
        value: artistCost,
      });
      console.log('Got the tx hash', tx.hash); // Print the transaction hash
      setTxHash(tx.hash);

      setStatusState((prevState) => ({
        ...prevState,
        isLoading:
          'Waiting for transaction to be included in a block on the network...',
        isMessage: true,
        message: {
          title: `This could take some time... please be patient while the transaction is included in a block!`,
          description: (
            <a
              href={`${network.blockExplorer}${tx.hash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Transaction Status in block explorer here
            </a>
          ),
        },
      }));
      setSnackbar({
        type: 'success',
        open: true,
        message: `Transaction submitted to the FVM network: ${tx.hash}...`,
      });
      const receipt = await tx.wait();
      console.log('----------TX INCLUDED IN BLOCK------------');
      console.log(JSON.stringify(receipt, null, 4));
      console.dir('Receipt:', receipt.transactionHash);

      //poll for events

      setSnackbar({
        type: 'success',
        open: true,
        message: `Transaction included in block - training model on images...!`,
      });

      setStatusState((prevState) => ({
        ...prevState,
        isLoading: 'Training your AI model on your images on Bacalhau...!',
        isMessage: true,
        message: {
          title: `Training your AI model on your images on Bacalhau...!`,
          description: (
            <>
              <div>
                Please be patient... This takes a few hours or so depending on
                demand.
              </div>
              <a
                href={`${network.blockExplorer[0]}${tx.hash}`}
                target="_blank"
                rel="no_referrer"
              >
                Check Transaction in block explorer
              </a>
            </>
          ), //receipt.transactionHash
        },
      }));

      return receipt.transactionHash;
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.toString();
      if (error?.error?.data?.message.includes('revert reason:')) {
        const match = error.error.data.message.match(
          /revert reason: Error\((.*?)\)/
        );
        errorMessage = match[1];
      }
      if (errorMessage.length > 64) {
        errorMessage = errorMessage.substring(0, 64) + '...';
      }
      setSnackbar({
        type: 'error',
        open: true,
        message: errorMessage,
      });
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '',
        isError: true,
        isMessage: true,
        message: {
          title: errorMessage,
          description: <span>{errorMessage}</span>,
        },
      }));
      return '';
    }
  };

  // MOVE TO IMAGE CONTEXT - doesn't belong in contract
  const submitArtistFormToAPI = async (
    artistid: string,
    data: any,
    images: File[],
    avatar: File[],
    thumbnails: File[]
  ) => {
    try {
      const url = getAPIServer('/register');

      data.artistid = artistid;

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      images.forEach((image) => {
        formData.append('images', image);
      });
      avatar.forEach((image) => {
        formData.append('avatar', image);
      });
      thumbnails.forEach((image) => {
        formData.append('thumbnails', image);
      });

      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // set the content type header
        },
      });

      setSnackbar({
        type: 'success',
        open: true,
        message: `Form Submitted...!`,
      });

      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '', //stop loading now
        isMessage: true,
        message: {
          title: `Congratulations ${data.name}! We're training an AI model on your images with Bacalhau!`,
          description: (
            <>
              <div>
                Training a model takes a few hours or so depending on demand.
                Check back soon to find your profile live on Waterlily.ai!
              </div>
              <a
                href={`${network.blockExplorer}${txHash}`}
                target="_blank"
                rel="no_referrer"
              >
                Check Transaction in block explorer
              </a>
            </>
          ), //receipt.transactionHash
        },
      }));
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.toString();
      if (error?.error?.data?.message.includes('revert reason:')) {
        const match = error.error.data.message.match(
          /revert reason: Error\((.*?)\)/
        );
        errorMessage = match[1];
      }
      if (errorMessage.length > 64) {
        errorMessage = errorMessage.substring(0, 64) + '...';
      }
      setSnackbar({
        type: 'error',
        open: true,
        message: errorMessage,
      });
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '',
        isError: true,
        isMessage: true,
        message: {
          title: 'Error uploading to server',
          description: <span>{errorMessage}</span>,
        },
      }));
    }
  };

  interface NFTCollection {
    tokenURI: string;
  }

  /* 
    Helper function for fetching the Filecoin data through IPFS gateways 
    to display the images in the UI 
    Needs to be a hook with loading state
  */
  const createImageURLsForRetrieval = async (collection: NFTCollection[]) => {
    if (!collection || !collection[0]) return;
    // only return the 5 most recent NFT images
    // this collection is fetched on webpage load
    const dataCollection = collection
      .slice()
      .reverse()
      // .slice(0, limit)
      .map((el) => {
        return el;
      });

    const imgURLs: NFTJson[] = await Promise.all(
      dataCollection.map(async (el) => {
        const ipfsGatewayLink = `${ipfsHttpGatewayLink}${el.tokenURI}/metadata.json`;
        const response = await fetch(ipfsGatewayLink);
        if (response.status !== 200) {
          return;
        }

        const json = await response.json();

        const displayStr = json.image.split('/');

        const displayUrl = `https://nftstorage.link/ipfs/${displayStr[2]}/blob`;
        const displayJson = { ...json, image: displayUrl };

        return displayJson;
      })
    );

    console.log('imgURLs nfts', imgURLs);
    return imgURLs;
  };

  const fetchNFTImagesByOwner = async () => {
    if (
      !walletState?.isConnected ||
      walletState.accounts.length <= 0 ||
      !Boolean(contractState.connectedWaterlilyNFTContract)
    ) {
      return;
    }
    if (contractState && contractState.connectedWaterlilyNFTContract) {
      console.log('fetching nfts by owner from contract');
      await contractState.connectedWaterlilyNFTContract
        .getNFTCollectionByOwner(walletState.accounts[0])
        .then(async (nftCollection: any) => {
          console.log('fetched nfts nftcollection', nftCollection);
          await createImageURLsForRetrieval(nftCollection)
            .then((data: NFTJson[] | undefined) => {
              if (data) setNftImages(data);
            })
            .catch((err) => {
              console.log('error creating links', err);
            });
        })
        .catch((err: any) => {
          console.log('error fetching nfts', err.message);
        });
    }
  };

  const mintNFT = async (image: { link: string; alt: string }) => {
    if (!window.ethereum) {
      setStatusState({
        ...statusState,
        isError: 'Web3 not available',
        isMessage: true,
        message: {
          title: 'Web3 not available',
          description:
            'Please install and unlock a Web3 provider in your browser to use this application.',
        },
      });
      return;
    }
    console.log('saving to NFT.storage', image);
    const metadata: any = await saveToNFTStorage(image);
    if (!metadata || !metadata.url) {
      console.log('no metadata?', metadata);
      // throw Error();
      return;
    }

    console.log('Connecting to NFT Contract...');
    const connectedNftContract = getWaterlilyNFTWriteContractConnection();
    if (!connectedNftContract) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'Something went wrong connecting to the NFT Contract',
      });
      return;
    }
    console.log('Calling NFT Minting function...');
    const tx = await connectedNftContract.mintWaterlilyNFT(
      walletState?.accounts[0],
      metadata?.ipnft
      //metadata ipfs uri
    );
    setStatusState((prevState) => ({
      ...prevState,
      isLoading:
        'Waiting for transaction to be included in a block on the network...',
      isMessage: true,
      message: {
        title: `This could take some time... please be patient while the transaction is included in a block!`,
        description: (
          <a
            href={`${network.blockExplorer}${tx.hash}`}
            target="_blank"
            rel="no_referrer"
          >
            Check Transaction Status in block explorer here
          </a>
        ),
      },
    }));
    setSnackbar({
      type: 'success',
      open: true,
      message: `Transaction submitted to the FVM network: ${tx.hash}...`,
    });
    const receipt = await tx.wait();
    console.log('receipt - NFT Minted!', receipt);
    setSnackbar({
      type: 'success',
      open: true,
      message: `NFT Minted!`,
    });
    setStatusState((prevState) => ({
      ...prevState,
      isLoading: '',
      isMessage: true,
      message: {
        title: `NFT Minted`,
        description: (
          <a
            href={`${network.blockExplorer}${tx.hash}`}
            target="_blank"
            rel="no_referrer"
          >
            Check Transaction in block explorer
          </a>
        ), //receipt.transactionHash
      },
    }));
    fetchNFTImagesByOwner();
  };

  //THESE GO LAST
  const contractContextValue: ContractContextValue = {
    contractState,
    setContractState,
    customerImages,
    nftImages,
    runStableDiffusionJob,
    mintNFT,
    registerArtistWithContract,
    submitArtistFormToAPI,
    artistCost,
    imageCost,
  };

  return (
    <ContractContext.Provider value={contractContextValue}>
      {children}
    </ContractContext.Provider>
  );
};
