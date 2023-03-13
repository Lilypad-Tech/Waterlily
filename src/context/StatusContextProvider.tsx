import React, {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
  useCallback,
} from 'react';

export interface SnackbarStatus {
  open: boolean;
  type?: string;
  message?: string;
}

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
  snackbar: SnackbarStatus;
  setSnackbar: Dispatch<SetStateAction<SnackbarStatus>>;
  closeSnackbar: () => void;
  resetStatusState: () => void;
}

export const defaultStatusState = {
  statusState: {
    isLoading: '',
    isError: '',
    isMessage: false,
    message: null,
  },
  snackbar: {
    open: false,
    type: '',
    message: '',
  },
  setStatusState: () => {},
  setSnackbar: () => {},
  closeSnackbar: () => {},
  resetStatusState: () => {},
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

  const [snackbar, setSnackbar] = useState<SnackbarStatus>({
    open: false,
    type: '',
    message: '',
  });

  const closeSnackbar = useCallback(() => {
    setSnackbar({
      open: false,
      type: '',
      message: '',
    })
  }, [])

  const resetStatusState = useCallback(() => {
    setSnackbar({
      open: false,
      type: '',
      message: '',
    })
    setStatusState({
      isLoading: '',
      isError: '',
      isMessage: false,
      message: null,
    })
  }, [])

  const statusContextValue: StatusContextValue = {
    statusState,
    setStatusState,
    snackbar,
    setSnackbar,
    closeSnackbar,
    resetStatusState,
  };

  return (
    <StatusContext.Provider value={statusContextValue}>
      {children}
    </StatusContext.Provider>
  );
};
