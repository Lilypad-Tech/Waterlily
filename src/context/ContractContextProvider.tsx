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
  WalletContext,
  defaultWalletState,
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
  isConnected: boolean;
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

export const defaultContractState = {
  contractState: {
    isConnected: false,
    mode: AccessType.Read,
    provider: new ethers.providers.JsonRpcProvider(rpc),
    signer: null,
    connectedWaterlilyContract: new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      new ethers.providers.JsonRpcProvider(rpc)
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
  const { statusState = defaultStatusState.statusState, setStatusState } =
    useContext(StatusContext);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);

  /* Init */
  useEffect(() => {
    getContractConnection(); //this also sets the listeners
  }, []);

  useEffect(() => {
    if (walletState.accounts.length > 0) {
      const signer = new ethers.providers.Web3Provider(
        window.ethereum
      ).getSigner();
      contractState.connectedWaterlilyContract?.connect(signer);
    }
  }, [walletState.accounts]);

  const getContractConnection = () => {
    console.log('Connecting to contract...');
    let provider = null,
      signer = null,
      waterlilyContract = null;
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      waterlilyContract = new ethers.Contract(
        WATERLILY_CONTRACT_ADDRESS,
        WaterlilyABI.abi,
        signer
      );
      // waterlilyContract.connect(signer); //want to be able to change this on wallet change
      setContractState({
        mode: AccessType.Write,
        isConnected: true,
        provider,
        signer,
        connectedWaterlilyContract: waterlilyContract,
      });
    } else {
      //READ MODE ONLY
      provider = new ethers.providers.JsonRpcProvider(rpc);
      waterlilyContract = new ethers.Contract(
        WATERLILY_CONTRACT_ADDRESS,
        WaterlilyABI.abi,
        provider
      );
      setContractState({
        mode: AccessType.Read,
        isConnected: true,
        provider,
        signer,
        connectedWaterlilyContract: waterlilyContract,
      });
    }
    console.log('Connected to contract...', waterlilyContract);
    setContractEventListeners();
  };

  const setContractEventListeners = () => {
    console.log('Setting up contract event listeners...');
    type StableDiffusionImage = {
      id: ethers.BigNumber;
      customer: string;
      artist: string;
      prompt: string;
      ipfsResult: string;
      errorMessage: string;
      isComplete: boolean;
      isCancelled: boolean;
    };
    const { connectedWaterlilyContract } = contractState;
    if (!connectedWaterlilyContract) {
      return;
    }
    connectedWaterlilyContract.on(
      'ImageGenerated',
      (image: StableDiffusionImage) => {
        console.log('ImageGenerated event received:', image);
      }
    );

    connectedWaterlilyContract.on('ImageCancelled', (image: any) => {
      console.log('ImageCancelled event received:', image);
    });
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
    //not updating - might need to use prevState style
    setStatusState({
      ...defaultStatusState.statusState,
      isLoading: 'Submitting Waterlily job to the FVM network ...',
    });

    const imageCost = ethers.utils.parseEther(IMAGE_COST);
    const gasLimit: string = ethers.utils.hexlify(GAS_LIMIT);

    try {
      const tx = await contractState.connectedWaterlilyContract.StableDiffusion(
        artistid,
        prompt,
        {
          value: imageCost,
        }
      );
      setStatusState((prevState) => ({
        ...prevState,
        isLoading:
          'Waiting for transaction to be included in a block on the network...',
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
          isLoading: '',
          isMessage: true,
          message: {
            title: 'TX successful on network',
            description: `Receipt:`,
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

  const fetchAllImages = async () => {
    /*listImages*/
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
