import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

interface StableDiffusionState {
  isLoading: boolean;
  isError: string | null;
  data?: any;
}

interface StableDiffusionContextValue {
  stableDiffusionState?: StableDiffusionState;
  setStableDiffusionState: Dispatch<SetStateAction<StableDiffusionState>>;
  runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
}

const defaultStableDiffusionState = {
  stableDiffusionState: { isLoading: false, isError: null, data: null },
  setStableDiffusionState: () => {},
  runStableDiffusionJob: async () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const StableDiffusionContext =
  createContext<StableDiffusionContextValue>(defaultStableDiffusionState);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const StableDiffusionContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const [stableDiffusionState, setStableDiffusionState] =
    useState<StableDiffusionState>({
      isLoading: false,
      isError: null,
      data: null,
    });

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    setStableDiffusionState({ ...stableDiffusionState, isLoading: true });
    console.log('stable diffusion job called', stableDiffusionState);
    await delay(5000);
    console.log('delay over', stableDiffusionState);
    await fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data) => {
        console.log('stable diffuion done', stableDiffusionState);
        setStableDiffusionState({ ...stableDiffusionState, data: data });
      })
      .finally(() => {
        setStableDiffusionState({ ...stableDiffusionState, isLoading: false });
      })
      .catch((err) => {
        console.log('err stable diffusion', err);
        setStableDiffusionState({
          isLoading: false,
          isError: err || 'error',
          data: null,
        });
      });
  };

  const stableDiffusionContextValue: StableDiffusionContextValue = {
    stableDiffusionState,
    setStableDiffusionState,
    runStableDiffusionJob,
  };

  return (
    <StableDiffusionContext.Provider value={stableDiffusionContextValue}>
      {children}
    </StableDiffusionContext.Provider>
  );
};

// const useStableDiffusionContext = (): StableDiffusionContextValue =>
//   useContext(StableDiffusionContext);

// export {
//   StableDiffusionContextProvider,
//   useStableDiffusionContext,
//   defaultStableDiffusionState,
// };

// const StableDiffusionContextProvider =
//   createContext<StableDiffusionContextType>(defaultStableDiffusionState);

// const useSDContext = () => {
//   const stableDiffusionContext = useContext(StableDiffusionContextProvider);

//   if (!stableDiffusionContext) {
//     throw new Error(
//       'useSDContext has to be used within <StableDiffusionContext.Provider>'
//     );
//   }

//   return stableDiffusionContext;
// };
