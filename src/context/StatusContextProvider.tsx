import React, {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
} from 'react';

export interface StatusState {
  isLoading: string | ReactNode; //empty str if not loading
  isError: string | ReactNode; //empty str if no error
  isMessage: boolean;
  message: {
    title: ReactNode | string;
    description: ReactNode | string;
  } | null;
}

interface StatusContextValue {
  statusState?: StatusState;
  setStatusState: Dispatch<SetStateAction<StatusState>>;
}

export const defaultStatusState = {
  statusState: {
    isLoading: '',
    isError: '',
    isMessage: false,
    message: null,
  },
  setStatusState: () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const StatusContext =
  createContext<StatusContextValue>(defaultStatusState);

export const StatusContextProvider = ({ children }: MyContextProviderProps) => {
  const [statusState, setStatusState] = useState<StatusState>(
    defaultStatusState.statusState
  );

  const statusContextValue: StatusContextValue = {
    statusState,
    setStatusState,
  };

  return (
    <StatusContext.Provider value={statusContextValue}>
      {children}
    </StatusContext.Provider>
  );
};
