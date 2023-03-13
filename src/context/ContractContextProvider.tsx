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
  jobFromAddress: string;
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
  jobFromAddress: '',
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
  const { statusState = defaultStatusState.statusState, setStatusState } =
    useContext(StatusContext);
  const { imageState, setImageState } = useContext(ImageContext);

  const [jobFromAddress, setjobFromAddress] = useState(
    defaultContractState.jobFromAddress
  );

  /* Init */
  useEffect(() => {
    setContractEventListeners();
    // getContractConnection();
  }, []);

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
    // let provider = null,
    //   signer = null,
    //   waterlilyContract = null;
    // if (window.ethereum && walletState.accounts.length > 0) {
    //   provider = new ethers.providers.Web3Provider(window.ethereum);
    //   signer = provider.getSigner();
    //   waterlilyContract = new ethers.Contract(
    //     WATERLILY_CONTRACT_ADDRESS,
    //     WaterlilyABI.abi,
    //     signer
    //   );
    //   // waterlilyContract.connect(signer); //want to be able to change this on wallet change
    //   setContractState({
    //     mode: AccessType.Write,
    //     isConnected: true,
    //     provider,
    //     signer,
    //     connectedWaterlilyContract: waterlilyContract,
    //   });
    // } else if (window.ethereum) {
    //   provider = new ethers.providers.Web3Provider(window.ethereum);
    //   waterlilyContract = new ethers.Contract(
    //     WATERLILY_CONTRACT_ADDRESS,
    //     WaterlilyABI.abi,
    //     provider
    //   );
    //   setContractState({
    //     mode: AccessType.Read,

    //     provider,
    //     signer,
    //     connectedWaterlilyContract: waterlilyContract,
    //   });
    // } else {
    //   //READ MODE ONLY
    //   provider = new ethers.providers.JsonRpcProvider(rpc);
    //   waterlilyContract = new ethers.Contract(
    //     WATERLILY_CONTRACT_ADDRESS,
    //     WaterlilyABI.abi,
    //     provider
    //   );
    //   setContractState({
    //     mode: AccessType.Read,

    //     provider,
    //     signer,
    //     connectedWaterlilyContract: waterlilyContract,
    //   });
    // }
    console.log('Connected to contract...', waterlilyContract);
  };

  const setContractEventListeners = () => {
    console.log('Setting up contract event listeners...');

    contractState.connectedWaterlilyContract.on(
      'ImageGenerated',
      (image: any) => {
        const generatedImage = {
          id: image[0].toString(), // convert BigNumber to string
          customer: image[1],
          artist: image[2],
          prompt: image[3],
          ipfsResult: image[4],
          errorMessage: image[5],
          isComplete: image[6],
          isCancelled: image[7],
        };
        setImageState({ generatedImages: generatedImage });
        const customerAddress = '0xc7653D426F2EC8Bc33cdDE08b15F535E2EB2F523';
        if (image.customer.toLowerCase() === customerAddress.toLowerCase()) {
          console.log('ImageGenerated event received for customer:');
          console.table(image);

          setStatusState((prevState) => ({
            ...prevState,
            isLoading: '',
            isMessage: true,
            message: {
              title: 'Bacalhau Stable Diffusion Job Success',
              description: `See transaction on blockExplorer..`,
            },
          }));
          // do something with the event - status & display
          // call a function to do this. image context?
        }
        // console.log('ImageGenerated event received:', image);
        setStatusState((prevState) => ({
          ...prevState,
          isLoading: '',
          isMessage: true,
          message: {
            title: 'Successfully ran WaterLily Stable Diffusion Job',
            description: 'Images: ...',
          },
        }));
        // return image;
      }
    );

    contractState.connectedWaterlilyContract.on(
      'ImageCancelled',
      (image: StableDiffusionImage) => {
        console.log('ImageCancelled event received:', image);
        // return image;
      }
    );
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    setImageState({ ...imageState, generatedImages: null });
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
    const gasLimit: string = ethers.utils.hexlify(GAS_LIMIT);

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
          title: 'TX successful on network',
          description: `TX: ${tx.hash}`,
        },
      }));
      console.log('got tx hash', tx.hash); // Print the transaction hash
      try {
        const receipt = await tx.wait();
        console.log('got receipt', receipt);
        setStatusState((prevState) => ({
          ...prevState,
          isLoading: 'Running Stable Diffusion Job on Bacalhau...',
          isMessage: true,
          message: {
            title: 'TX successful on network',
            description: `Receipt: ${tx.hash}`, //receipt.transactionHash
          },
        }));

        return;
      } catch (error) {
        console.log('receipt err', error);
        setStatusState((prevState) => ({
          ...prevState,
          isLoading: '',
          isError: 'yep receipt error',
        }));
      }
    } catch (error) {
      console.log('tx error', error);
      setStatusState((prevState) => ({
        ...prevState,
        isLoading: '',
        isError: 'yep error',
      }));
    }
  };

  const stableDiffusionJobReturned = (results: any) => {};

  const fetchAllImages = async () => {
    /*listImages*/
  };

  //THESE GO LAST
  const contractContextValue: ContractContextValue = {
    contractState,
    setContractState,
    runStableDiffusionJob,
    jobFromAddress,
  };

  return (
    <ContractContext.Provider value={contractContextValue}>
      {children}
    </ContractContext.Provider>
  );
};