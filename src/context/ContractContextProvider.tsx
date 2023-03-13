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
  connectedWaterlilyContract: ethers.Contract | null;
}

interface ContractContextValue {
  contractState?: ContractState;
  setContractState: Dispatch<SetStateAction<ContractState>>;
}

export const defaultContractState = {
  contractState: {
    isConnected: false,
    mode: AccessType.Read,
    provider: new ethers.providers.JsonRpcProvider(rpc),
    signer: null,
    connectedWaterlilyContract: null,
  },
  setContractState: () => {},
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
      waterlilyContract = new ethers.Contract(
        WATERLILY_CONTRACT_ADDRESS,
        WaterlilyABI.abi,
        provider
      );
      signer = provider.getSigner();
      waterlilyContract.connect(signer); //want to be able to change this on wallet change
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

  //THESE GO LAST
  const contractContextValue: ContractContextValue = {
    contractState,
    setContractState,
  };

  return (
    <ContractContext.Provider value={contractContextValue}>
      {children}
    </ContractContext.Provider>
  );
};
