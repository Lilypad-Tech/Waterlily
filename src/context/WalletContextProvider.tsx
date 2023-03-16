declare let window: any;
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react';
import { ethers } from 'ethers';
import { ImageContext, NetworkContext, NetworkDataType } from '.';

import { getNetwork } from '../definitions/network';

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
  verifyChainId: (reqChainId: string) => boolean;
  changeWalletChain: (reqChainId: string) => Promise<void>;
  addNetwork: (networkData: NetworkDataType) => Promise<void>;
  disconnectWallet: () => void;
  checkBalance: () => Promise<number | null> | null;
}

export const defaultWalletState = {
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
  verifyChainId: (reqChainId: string) => {
    return false;
  },
  changeWalletChain: async (reqChainId: string) => {},
  addNetwork: async () => {},
  disconnectWallet: () => {},
  checkBalance: () => {
    return null;
  },
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const WalletContext =
  createContext<WalletContextValue>(defaultWalletState);

export const WalletContextProvider = ({ children }: MyContextProviderProps) => {
  const [walletState, setWalletState] = useState<WalletState>(
    defaultWalletState.walletState
  );
  const { resetAllImageContext } = useContext(ImageContext);
  const { network } = useContext(NetworkContext);

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
      setWalletState({
        isConnected: true,
        accounts: accounts,
        chainId: chainId,
        web3: true,
      });
      if (!verifyChainId(network.chainId)) {
        await changeWalletChain(network.chainId);
      }
    } else {
      setWalletState(defaultWalletState.walletState);
    }
  };

  const disconnectWallet = () => {
    resetAllImageContext();
    if (window.ethereum) {
      setWalletState({
        ...walletState,
        accounts: [],
        isConnected: false,
      });
    } else {
      setWalletState(defaultWalletState.walletState);
    }
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
      setWalletState(defaultWalletState.walletState);
    }
  };

  const setWalletListeners = () => {
    console.log('Setting up wallet event listeners...');
    if (window.ethereum) {
      // subscribe to provider events compatible with EIP-1193 standard.
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        //logic to check if disconnected accounts[] is empty
        if (accounts.length < 1) {
          //handle the locked wallet case
          setWalletState({ ...walletState, isConnected: false, web3: true });
        } else {
          setWalletState({
            ...walletState,
            accounts: accounts,
            isConnected: true,
            web3: true,
          });
        }
      });
      // Subscribe to chainId change
      window.ethereum.on('chainChanged', (chainId: string) => {
        console.log('chainId changed', chainId, walletState);
        if (chainId === null) {
          //handle the locked wallet case
          setWalletState((prevState: any) => ({
            ...prevState,
            accounts: [],
            chainId: chainId,
            isConnected: false,
          }));
        } else {
          setWalletState((prevState: any) => ({
            ...prevState,
            chainId: chainId,
          }));
        }
      });
    } else {
      setWalletState(defaultWalletState.walletState);
    }
  };

  const checkBalance = async () => {
    if (!window.ethereum || !walletState.accounts[0]) {
      return null;
    }
    const provider = new ethers.providers.JsonRpcProvider(network.rpc[0]);
    try {
      const balance = await provider.getBalance(walletState.accounts[0]);
      const formattedBalance = ethers.utils.formatEther(balance);
      const balanceNumber = parseFloat(formattedBalance);
      return balanceNumber;
    } catch (error) {
      console.log('error getting balance', error);
      return null;
    }
  };

  const verifyChainId = (reqChainId: string) => {
    console.log(`Verifying wallet chain matches ${reqChainId}...`);
    if (walletState.chainId !== reqChainId) {
      console.log('wrong chain');
      return false;
      //display a popup to change wallet?
    } else return true;
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
          if (err.code === 4902) {
            console.log('Adding the filecoin chain to wallet');
            addNetwork(getNetwork());
            // Make a request to add the chain to wallet here
            console.log(
              "Chain hasn't been added to the wallet yet... trying to add"
            );
            // addNetwork(network);
          }
        });
    } else {
      setWalletState(defaultWalletState.walletState);
    }
  };

  const addNetwork = async ({
    chainId,
    rpc,
    name,
    nativeCurrency,
    blockExplorer,
  }: NetworkDataType) => {
    console.log('Adding new network to wallet ', name, rpc);
    if (window.ethereum) {
      // const add = await checkForNetwork();
      // console.log('is add true', add);
      // if (add) return;
      console.log('adding filecoin network...');
      window.ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainId,
              rpcUrls: network.rpc,
              chainName: name,
              nativeCurrency: nativeCurrency,
              blockExplorerUrls: blockExplorer || [],
            },
          ],
        })
        .then((res: XMLHttpRequestResponseType) => {
          console.log(`Successfully added ${name} network`, res);
        })
        .catch((err: ErrorEvent) => {
          console.log(`Error adding ${name} network`, err);
        });
    } else {
      setWalletState(defaultWalletState.walletState);
    }
  };

  const checkForNetwork = async () => {
    if (!window.ethereum) return;
    const network = getNetwork()
    const networkId = network.chainId;
    try {
      const currentNetworkId = await window.ethereum.request({
        method: 'net_version',
      });
      if (
        currentNetworkId === network.chainId ||
        parseInt(currentNetworkId, 10) ===
          parseInt(network.chainId, 16)
      ) {
        console.log(`The Filecoin Mainnet network is currently selected.`);
        return true;
      } else {
        console.log(`The Filecoin Mainnet network is not currently selected.`);
        changeWalletChain(network.chainId);
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
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
    checkBalance,
  };

  return (
    <WalletContext.Provider value={walletContextValue}>
      {children}
    </WalletContext.Provider>
  );
};
