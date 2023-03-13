import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import { ethers } from 'ethers';

export interface StableDiffusionImage {
  id: ethers.BigNumber | string;
  customer: string;
  artist: string;
  prompt: string;
  ipfsResult: string;
  errorMessage: string;
  isComplete: boolean;
  isCancelled: boolean;
}

export interface ImageState {
  generatedImages: StableDiffusionImage | null;
  /*
    myImages - list
    myNFTs - list
  */
}

interface ImageContextValue {
  imageState: ImageState;
  setImageState: Dispatch<SetStateAction<ImageState>>;
}

export const defaultImageState = {
  imageState: {
    generatedImages: null,
  },
  setImageState: () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ImageContext = createContext<ImageContextValue>(defaultImageState);

export const ImageContextProvider = ({ children }: MyContextProviderProps) => {
  const [imageState, setImageState] = useState<ImageState>(
    defaultImageState.imageState
  );

  useEffect(() => {
    console.log(imageState);
  }, [imageState]);

  const imageContextValue: ImageContextValue = {
    imageState,
    setImageState,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {children}
    </ImageContext.Provider>
  );
};
