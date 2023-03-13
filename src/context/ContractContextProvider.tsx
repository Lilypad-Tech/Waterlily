import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

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

/* Contracts */
import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
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
  const { imageState, setImageID, setImageState } = useContext(ImageContext);

  const getWriteContractConnection = () => {
    console.log('Connecting to contract...');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const waterlilyContract = new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    ); //   provider = new ethers.providers.Web3Provider(window.ethereum);
    return waterlilyContract;
  };

  const setContractEventListeners = () => {
    console.log('Setting up contract event listeners...');

    // contractState.connectedWaterlilyContract.on(
    //   'ImageGenerated',
    //   (image: any) => {
    //     const generatedImage = {
    //       id: image[0].toString(), // convert BigNumber to string
    //       customer: image[1],
    //       artist: image[2],
    //       prompt: image[3],
    //       ipfsResult: image[4],
    //       errorMessage: image[5],
    //       isComplete: image[6],
    //       isCancelled: image[7],
    //     };

    //     console.log('--------------------------------------------')
    //     console.log('generatedImage FROM EVENT')
    //     console.dir(generatedImage)
    //     // setImageState({ generatedImages: generatedImage });
    //     // const customerAddress = '0xc7653D426F2EC8Bc33cdDE08b15F535E2EB2F523';
    //     // if (image.customer.toLowerCase() === customerAddress.toLowerCase()) {
    //     //   console.log('ImageGenerated event received for customer:');
    //     //   console.table(image);

    //     //   setStatusState((prevState) => ({
    //     //     ...prevState,
    //     //     isLoading: '',
    //     //     isMessage: true,
    //     //     message: {
    //     //       title: 'Bacalhau Stable Diffusion Job Success',
    //     //       description: `See transaction on blockExplorer..`,
    //     //     },
    //     //   }));
    //     //   // do something with the event - status & display
    //     //   // call a function to do this. image context?
    //     // }
    //     // // console.log('ImageGenerated event received:', image);
    //     // setStatusState((prevState) => ({
    //     //   ...prevState,
    //     //   isLoading: '',
    //     //   isMessage: true,
    //     //   message: {
    //     //     title: 'Successfully ran WaterLily Stable Diffusion Job',
    //     //     description: 'Images: ...',
    //     //   },
    //     // }));
    //     // return image;
    //   }
    // );

    // contractState.connectedWaterlilyContract.on(
    //   'ImageCancelled',
    //   (image: StableDiffusionImage) => {
    //     console.log('ImageCancelled event received:', image);
    //     // return image;
    //     setStatusState((prevState) => ({
    //       ...prevState,
    //       isLoading: '',
    //       isError: 'Error Running Bacalhau Job',
    //       isMessage: true,
    //       message: {
    //         title: 'Error Running Bacalhau Job',
    //         description: 'Check logs for more info',
    //       },
    //     }));
    //   }
    // );
  };

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

    const connectedContract = getWriteContractConnection();
    if (!connectedContract) {
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
      
      const receipt = await tx.wait();

      console.log('--------------------------------------------')
      console.dir(receipt)
      console.log(JSON.stringify(receipt, null, 4))
      const results = receipt.logs.map((log: any) => connectedContract.interface.parseLog(log))
      // const [jobEvent] = receipt.logs.map((log: any) => connectedContract.interface.parseLog(log))
      // const jobID = jobEvent.args.job.id;

      // TODO: trigger the image downloader here
      // extract the image id from the event logs
      // trigger the image context setImageID
      // also setImageID(number)
      console.log('got receipt', receipt);
      // console.log('got jobEvent', jobEvent);
      // console.log('got jobID', jobID);

      // setImageID(jobID);

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
