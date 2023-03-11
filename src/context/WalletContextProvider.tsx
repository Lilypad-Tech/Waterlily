declare let window: any;
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';

interface networkType {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}

interface WalletState {
  accounts: string[];
  chainId: string; //chainId type?
  isConnected: boolean; // have accounts
  web3: boolean; //check for window.ethereum object
  // message: string;
}

interface WalletContextValue {
  walletState?: WalletState;
  setWalletState: Dispatch<SetStateAction<WalletState>>;
  //actions for wallet here
  fetchWalletAccounts: () => Promise<string[]>;
  fetchChainId: () => Promise<string>;
  connectWallet: () => Promise<void>;
  // checkForWalletConnection: () => Promise<boolean | undefined>;
  checkForWalletConnection: () => Promise<void>;
  verifyChainId: (reqChainId: string) => Promise<boolean | undefined>;
  changeWalletChain: (reqChainId: string) => Promise<boolean | undefined>;
  addNetwork: (networkData: networkType) => Promise<void>;
  disconnectWallet: () => void;
}

const defaultWalletState = {
  walletState: {
    accounts: [] as string[],
    chainId: '',
    isConnected: false,
    web3: false,
  },
  setWalletState: () => {},
  fetchWalletAccounts: async (): Promise<string[]> => {
    return [];
  },
  fetchChainId: async (): Promise<string> => {
    return '';
  },
  connectWallet: async () => {},
  // checkForWalletConnection: async (): Promise<boolean> => {
  //   return false;
  // },
  checkForWalletConnection: async () => {},
  verifyChainId: async (reqChainId: string) => {
    return false;
  },
  changeWalletChain: async (reqChainId: string) => {
    return false;
  },
  addNetwork: async () => {},
  disconnectWallet: (): void => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const WalletContext =
  createContext<WalletContextValue>(defaultWalletState);

export const WalletContextProvider = ({ children }: MyContextProviderProps) => {
  const INITIAL_WALLET_STATE = {
    accounts: [],
    chainId: '',
    isConnected: false,
    web3: false,
  };
  const [walletState, setWalletState] =
    useState<WalletState>(INITIAL_WALLET_STATE);

  useEffect(() => {
    if (window.ethereum) {
      setWalletState({ ...walletState, web3: true });
      checkForWalletConnection();
      setWalletListeners();
    }
  }, []);

  useEffect(() => {
    console.log('wallet state changed', walletState);
  }, [walletState]);

  ///wallet action functions
  const fetchWalletAccounts = async () => {
    console.log('Fetching wallet accounts...');
    return await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => {
        return accounts;
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
          return [];
        } else {
          console.error(error);
          return [];
        }
      });
  };

  const fetchChainId = async () => {
    console.log('Fetching chainId...');
    return await window.ethereum
      .request({ method: 'eth_chainId' })
      .then((chainId: string) => {
        console.log('chainId', chainId, typeof chainId);
        return chainId;
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
          return '';
        } else {
          console.error(error);
          return '';
        }
      });
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      console.log('Connecting to wallet...');
      const accounts: string[] = await fetchWalletAccounts();
      const chainId = await fetchChainId();
      // setWalletListeners();
      setWalletState({
        isConnected: true,
        accounts: accounts,
        chainId: chainId,
        web3: true,
      });
    } else {
      setWalletState(INITIAL_WALLET_STATE);
    }
  };

  const disconnectWallet = () => {
    setWalletState({ ...INITIAL_WALLET_STATE, web3: true });
  };

  const checkForWalletConnection = async () => {
    if (window.ethereum) {
      console.log('Checking for Wallet Connection...');
      await window.ethereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          console.log('Connected to wallet...');
          const chainId = await fetchChainId();
          const connected = accounts.length > 0;
          setWalletState({
            web3: true,
            accounts: accounts,
            chainId: chainId,
            isConnected: connected,
          });
        })
        .catch((err: Error) => {
          console.log('Error fetching wallet', err);
        });
    } else {
      console.log('no web3');
      setWalletState(INITIAL_WALLET_STATE);
    }
  };

  const setWalletListeners = () => {
    console.log('Setting up wallet event listeners...');
    if (window.ethereum) {
      // subscribe to provider events compatible with EIP-1193 standard.
      window.ethereum.on('accountsChanged', (accounts: any) => {
        //logic to check if disconnected accounts[] is empty
        if (accounts.length < 1) {
          //handle the locked wallet case
          setWalletState({ ...walletState, isConnected: false });
        } else {
          setWalletState((prevState: WalletState) => ({
            ...prevState,
            accounts,
          }));
        }
      });
      // Subscribe to chainId change
      window.ethereum.on('chainChanged', (chainId: any) => {
        if (chainId === null) {
          //handle the locked wallet case
          setWalletState({ ...walletState, isConnected: false });
        } else {
          setWalletState((prevState: WalletState) => ({
            ...prevState,
            chainId,
          }));
        }
      });
    } else {
      setWalletState(INITIAL_WALLET_STATE);
    }
  };

  const verifyChainId = async (reqChainId: string) => {
    console.log(`Verifying wallet chain matches ${reqChainId}...`);
    if (walletState.chainId !== reqChainId) {
      console.log('wrong chain');
      return false;
      //display a popup to change wallet?
    }
    return true;
  };

  const changeWalletChain = async (reqChainId: string) => {
    if (window.ethereum) {
      console.log('Changing wallet chain...');
      await window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: reqChainId }],
        })
        .then((res: any) => {
          console.log('Switched Chain res...', res);
          setWalletState({ ...walletState, chainId: reqChainId });
        })
        .catch((err: any) => {
          console.log('Error changing chains', err);
          if (err.status === 4902) {
            // Make a request to add the chain to wallet here
            console.log("Chain hasn't been added to the wallet yet!");
          }
          return false;
        });
    } else {
      setWalletState(INITIAL_WALLET_STATE);
      return false;
    }
  };

  const addNetwork = async ({
    chainId,
    rpcUrls,
    chainName,
    nativeCurrency,
    blockExplorerUrls,
  }: networkType) => {
    console.log('Adding new network to wallet ', chainName);
    if (window.ethereum) {
      window.ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainId,
              rpcUrls: rpcUrls,
              chainName: chainName,
              nativeCurrency: nativeCurrency,
              blockExplorerUrls: blockExplorerUrls || [],
            },
          ],
        })
        .then((res: XMLHttpRequestResponseType) => {
          console.log(`Successfully added ${chainName} network`, res);
        })
        .catch((err: ErrorEvent) => {
          console.log(`Error adding ${chainName} network`, err);
        });
    } else {
      setWalletState(INITIAL_WALLET_STATE);
    }
  };

  const walletContextValue: WalletContextValue = {
    walletState,
    setWalletState,
    fetchWalletAccounts,
    fetchChainId,
    connectWallet,
    checkForWalletConnection,
    verifyChainId,
    changeWalletChain,
    addNetwork,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={walletContextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// const MetamaskContext =
//   createContext<MetamaskContextType>(initialMetamaskState);

// const useMetamask = () => {
//   const metamaskContext = useContext(MetamaskContext);

//   if (!metamaskContext) {
//     throw new Error(
//       'metamaskContext has to be used within <MetamaskContext.Provider>'
//     );
//   }

//   return metamaskContext;
// };

// export default useMetamask;
