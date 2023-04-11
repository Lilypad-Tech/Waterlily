import { useState, createContext, Dispatch, SetStateAction } from 'react';
import { getNetwork } from '@/definitions';
import React from 'react';

export interface NetworkDataType {
  name: string;
  apiServer: string;
  chainId: string;
  rpc: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string[];
  contracts: {
    WATERLILY_CONTRACT_ADDRESS: string;
    LILYPAD_EVENTS_CONTRACT_ADDRESS?: string;
    WATERLILY_NFT_CONTRACT_ADDRESS: string;
  };
  imageUrlRoot: string;
}

const currentNetwork: NetworkDataType = getNetwork();

interface NetworkContextValue {
  network: NetworkDataType;
  setNetwork: Dispatch<SetStateAction<NetworkDataType>>;
}

const defaultNetworkState = {
  network: getNetwork(),
  setNetwork: () => {},
};

export const NetworkContext =
  createContext<NetworkContextValue>(defaultNetworkState);

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const NetworkContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const [network, setNetwork] = useState<NetworkDataType>(currentNetwork); //keyof definitions/networks

  const networkContextValue: NetworkContextValue = {
    network,
    setNetwork,
  };

  return (
    <NetworkContext.Provider value={networkContextValue}>
      {children}
    </NetworkContext.Provider>
  );
};
