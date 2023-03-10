import { createContext, useContext } from 'react';

export interface StableDiffusionContextType {
  loading: boolean;
  error: string;
  data?: object | null;
}

export const defaultStableDiffusionState = {
  loading: false,
  error: '',
  data: null,
};

export const StableDiffusionContext = createContext<StableDiffusionContextType>(
  defaultStableDiffusionState
);

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
