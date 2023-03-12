import React, {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
} from 'react';
import { networks } from '../definitions/network';

const rpc = networks.filecoinHyperspace.rpc[0];

export interface ContractState {
  isConnected: boolean;
  mode: 'read' | 'write';
}

interface ContractContextContextValue {
  contractState?: ContractState;
  setContractState: Dispatch<SetStateAction<ContractState>>;
}

export const defaultContractState = {
  contractState: { isConnected: false, mode: 'read' },
  setContractState: () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ContractContextContext =
  createContext<ContractContextContextValue>(defaultContractState);

export const ContractContextContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const [contractState, setContractState] = useState<ContractState>({
    isConnected: false,
    mode: 'read',
  });

  const contractContextContextValue: ContractContextContextValue = {
    contractState,
    setContractState,
  };

  return (
    <ContractContextContext.Provider value={contractContextContextValue}>
      {children}
    </ContractContextContext.Provider>
  );
};
