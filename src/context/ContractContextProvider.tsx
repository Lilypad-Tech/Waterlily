import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import bluebird from 'bluebird';
/* contract tools */
declare let window: any;
import { ethers } from 'ethers';

/* Other Contexts */
import {
  StatusContext,
  defaultStatusState,
  ImageContext,
  IMAGE_COUNT,
  WalletContext,
  NetworkContext,
} from '.';

// /* Contracts */
// import {
//   WATERLILY_CONTRACT_ADDRESS,
//   LILYPAD_CONTRACT_ADDRESS,
// } from '@/definitions';

import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
import LilypadEventsABI from '../abi/LilypadEvents.sol/LilypadEvents.json';
import WaterlilyNFTABI from '../abi/WaterlilyNFT.sol/WaterlilyNFT.json';

const IMAGE_COST = '0.1';
const GAS_LIMIT = 9000000;

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
}

interface ContractContextValue {
  contractState?: ContractState;
  setContractState: Dispatch<SetStateAction<ContractState>>;
  customerImages: any[];
  runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
  mintNFT: (image: { link: string; alt: string }) => Promise<void>;
}

// const pr = new ethers.providers.JsonRpcProvider(network.rpc[0]);
export const defaultContractState = {
  contractState: {
    mode: AccessType.Read,
    provider: null,
    signer: null,
    connectedWaterlilyContract: null,
  },
  customerImages: [],
  setContractState: () => {},
  runStableDiffusionJob: async () => {},
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
  });
  const [customerImages, setCustomerImages] = useState<any[]>([]);
  const {
    statusState = defaultStatusState.statusState,
    setStatusState,
    setSnackbar,
  } = useContext(StatusContext);
  const { setImageID, quickImages, saveToNFTStorage } =
    useContext(ImageContext);
  const { walletState } = useContext(WalletContext);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (!walletState?.isConnected || walletState.accounts.length <= 0) return;
    // const connectedContract = getWaterlilyWriteContractConnection();
    const connectedContract = contractState.connectedWaterlilyContract;
    console.log('checking for customer images effect...', connectedContract);
    console.log('using provider', contractState.provider);
    //Bug in contract - should not be public (then needs to be a write contract)
    const doAsync = async () => {
      const imageIDs = await connectedContract?.getCustomerImages(
        walletState.accounts[0]
      );
      if (!imageIDs) return;
      console.log('Fetched imageIDs', imageIDs);
      const images = await bluebird.map(imageIDs, async (id: any) => {
        const image = await connectedContract?.getImage(id);
        return image;
      });
      console.log('fetched Images');
      setCustomerImages(images);
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
    console.log('Connecting to contract...');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      network.contracts.WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    );
  };

  const getEventsWriteContractConnection = () => {
    if (!window.ethereum || !walletState?.accounts[0]) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      network.contracts.LILYPAD_EVENTS_CONTRACT_ADDRESS,
      LilypadEventsABI.abi,
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
    const eventsContract = getEventsWriteContractConnection();
    console.log('Connected to event contract', eventsContract);
    const connectedContract = getWaterlilyWriteContractConnection();
    console.log('Connected to waterlily contract');

    if (!connectedContract || !eventsContract) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'Something went wrong connecting to contract',
      });
      return;
    }

    const imageCost = ethers.utils.parseEther(IMAGE_COST);

    try {
      console.log('Getting contract details...');
      const currentJobID = await eventsContract.currentJobID();
      const nextJobID = currentJobID.add(1);
      console.log('Fetched contract details:', currentJobID, nextJobID);
      console.log('Calling stable diffusion function...');
      const tx = await connectedContract.StableDiffusion(artistid, prompt, {
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
          title: `Please be patient... This takes 30 seconds or so depending on demand.`,
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

      const imageID = nextJobID;
      setImageID(imageID.toNumber()); //45;
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
    console.log('metadata mint', metadata);

    console.log('Connecting to NFT Contract...');
    const connectedNftContract = getWaterlilyNFTWriteContractConnection();
    console.log('Calling NFT Minting function...');
    const tx = await connectedNftContract?.mintWaterlilyNFT(
      walletState?.accounts[0],
      metadata?.ipnft
      //metadata ipfs uri
    );
    const receipt = await tx.wait();
    console.log('receipt - NFT Minted!', receipt);
  };

  //THESE GO LAST
  const contractContextValue: ContractContextValue = {
    contractState,
    setContractState,
    customerImages,
    runStableDiffusionJob,
    mintNFT,
  };

  return (
    <ContractContext.Provider value={contractContextValue}>
      {children}
    </ContractContext.Provider>
  );
};
