import { useState, createContext, Dispatch, SetStateAction } from 'react';
import { networks } from '@/definitions';
import React from 'react';

export interface NetworkDataType {
  name: string;
  chainId: string;
  rpc: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string[];
}

interface NetworkContextValue {
  network: NetworkDataType;
  setNetwork: Dispatch<SetStateAction<NetworkDataType>>;
}

const defaultNetworkState = {
  network: networks.filecoinMainnet,
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
  const [network, setNetwork] = useState<NetworkDataType>(
    networks.filecoinMainnet
  ); //keyof definitions/networks

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