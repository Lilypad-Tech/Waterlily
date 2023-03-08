declare let window: any;
import { createContext, useContext } from 'react';

interface MetamaskContextType {
  accounts: string[];
  chain: { id: string; name: string }; //chainId type?
  isConnected: boolean;
  web3: boolean; //if ethereum object is being injected
}

const initialMetamaskState = {
  accounts: [],
  chain: { id: 'null', name: '' },
  isConnected: false,
  web3: false,
};

const MetamaskContext =
  createContext<MetamaskContextType>(initialMetamaskState);

const useMetamask = () => {
  const metamaskContext = useContext(MetamaskContext);

  if (!metamaskContext) {
    throw new Error(
      'metamaskContext has to be used within <MetamaskContext.Provider>'
    );
  }

  return metamaskContext;
};
