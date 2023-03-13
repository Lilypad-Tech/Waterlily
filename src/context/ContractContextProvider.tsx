import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import bluebird from 'bluebird'
/* contract tools */
declare let window: any;
import { ethers } from 'ethers';

/* Other Contexts */
import {
  StatusContext,
  defaultStatusState,
  ImageContext,
  StableDiffusionImage,
} from '.';

import {
  IMAGE_COUNT,
} from './ImageContextProvider';

/* Contracts */
import { WATERLILY_CONTRACT_ADDRESS, LILYPAD_CONTRACT_ADDRESS } from '@/definitions';
import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
import LilypadEventsABI from '../abi/LilypadEvents.sol/LilypadEvents.json';
const IMAGE_COST = '0.1';
const GAS_LIMIT = 9000000;

/* Networks */
import { currentNetwork, networks } from '../definitions/network';
const rpc =
  currentNetwork === 'testnet'
    ? networks.filecoinHyperspace.rpc[0]
    : networks.filecoinMainnet.rpc[0];

const blockExplorerRoot =
  currentNetwork === 'testnet'
    ? networks.filecoinHyperspace.blockExplorer[0]
    : networks.filecoinMainnet.blockExplorer[0];

/* ContractContext */
enum AccessType {
  Read = 'read',
  Write = 'write',
}

export interface ContractState {
  mode: AccessType;
  provider: ethers.providers.Provider | null;
  signer: ethers.Signer | null;
  connectedWaterlilyContract: ethers.Contract;
}

interface ContractContextValue {
  contractState?: ContractState;
  setContractState: Dispatch<SetStateAction<ContractState>>;
  runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
}

const pr = new ethers.providers.JsonRpcProvider(rpc);

export const defaultContractState = {
  contractState: {
    mode: AccessType.Read,
    provider: pr,
    signer: null,
    connectedWaterlilyContract: new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      pr
    ),
  },
  setContractState: () => {},
  runStableDiffusionJob: async () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ContractContext =
  createContext<ContractContextValue>(defaultContractState);

export const ContractContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const [contractState, setContractState] = useState<ContractState>(
    defaultContractState.contractState
  );
  const { statusState = defaultStatusState.statusState, setStatusState, setSnackbar } =
    useContext(StatusContext);
  const { setImageID, setImageState, quickImages } = useContext(ImageContext);
  const [ txHash, setTxHash ] = useState('')

  const getWriteContractConnection = () => {
    console.log('Connecting to contract...');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waterlilyContract = new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    ); //   provider = new ethers.providers.Web3Provider(window.ethereum);
    const lilypadEventsContract = new ethers.Contract(
      LILYPAD_CONTRACT_ADDRESS,
      LilypadEventsABI.abi,
      signer
    ); //   provider = new ethers.providers.Web3Provider(window.ethereum);
    return [waterlilyContract, lilypadEventsContract]
  };

  useEffect(() => {
    if(quickImages.length >= IMAGE_COUNT) {
      setSnackbar({
        type: 'success',
        open: true,
        message: `Images have been generated - finalizing transaction...`,
      })
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: 'Finalizing transaction on FVM...',
        isMessage: true,
        message: {
          title: `Receipt: ${txHash}`,
          description: (
            <a
              href={`${blockExplorerRoot}${txHash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Status in block explorer
            </a>
          ), //receipt.transactionHash
        },
      }));
    }
  }, [
    quickImages,
  ])

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    
    setImageState({ generatedImages: null });

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

    const [connectedContract, eventsContract] = getWriteContractConnection();
    if (!connectedContract || !eventsContract) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'Something went wrong connecting to contract',
      });
      return;
    }
    
    //not updating - might need to use prevState style
    setStatusState({
      ...defaultStatusState.statusState,
      isLoading: 'Submitting Waterlily job to the FVM network ...',
    });

    const imageCost = ethers.utils.parseEther(IMAGE_COST);
    
    try {
      const currentJobID = await eventsContract.currentJobID()
      const nextJobID = currentJobID.add(1)
      const tx = await connectedContract.StableDiffusion(artistid, prompt, {
        value: imageCost,
      });
      
      setStatusState((prevState) => ({
        ...prevState,
        isLoading:
          'Waiting for transaction to be included in a block on the FVM network...',
        isMessage: true,
        message: {
          title: `TX Hash: ${tx.hash}`,
          description: (
            <a
              href={`${blockExplorerRoot}${tx.hash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Status in block explorer
            </a>
          ),
        },
      }));
      console.log('got tx hash', tx.hash); // Print the transaction hash
      setTxHash(tx.hash);
      setSnackbar({
        type: 'success',
        open: true,
        message: `Transaction submitted to the FVM network: ${tx.hash}...`,
      })
      const receipt = await tx.wait();

      setSnackbar({
        type: 'success',
        open: true,
        message: `Transaction included in block - running stable diffusion on bacalhau...`,
      })

      console.log('--------------------------------------------')
      console.log(JSON.stringify(receipt, null, 4))
      console.dir(receipt)

      const imageID = nextJobID
      
      console.log('got image id', imageID.toString()); // Print the imageID
      
      setImageID(imageID.toNumber());

      setStatusState((prevState) => ({
        ...prevState,
        isLoading: 'Running Stable Diffusion Job on Bacalhau...',
        isMessage: true,
        message: {
          title: `Receipt: ${tx.hash}`,
          description: (
            <a
              href={`${blockExplorerRoot}${tx.hash}`}
              target="_blank"
              rel="no_referrer"
            >
              Check Status in block explorer
            </a>
          ), //receipt.transactionHash
        },
      }));

      let isComplete = false
      let isCancelled = false

      const checkJob = async () => {
        const job = await connectedContract.getImage(imageID)
        console.log(`checking job: complete: ${job.isComplete}, cancelled: ${job.isCancelled}`)
        if(job.isComplete) {
          isComplete = true
        } else if(job.isCancelled) {
          isCancelled = true
        }
      }

      while(!isComplete && !isCancelled) {
        await checkJob()
        if(isComplete || isCancelled) break
        await bluebird.delay(1000)
      }

      if(isComplete) {
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
        })
      } else if(isCancelled) {
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
        })
      }
      

    } catch (error: any) {
      console.error(error)
      let errorMessage = error.toString()
      if(error.error && error.error.data && error.error.data.message && error.error.data.message.includes('revert reason:')) {
        const match = error.error.data.message.match(/revert reason: Error\((.*?)\)/)
        errorMessage = match[1]
      }
      if(errorMessage.length > 64) {
        errorMessage = errorMessage.substring(0, 64) + '...'
      }
      setSnackbar({
        type: 'error',
        open: true,
        message: errorMessage
      })
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '',
        isError: true,
        message: {
          title: errorMessage,
          description: (
            <span>{errorMessage}</span>
          ),
        },
      }));
    }
  };

  //THESE GO LAST
  const contractContextValue: ContractContextValue = {
    contractState,
    setContractState,
    runStableDiffusionJob,
  };

  return (
    <ContractContext.Provider value={contractContextValue}>
      {children}
    </ContractContext.Provider>
  );
};
