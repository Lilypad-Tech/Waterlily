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
  prompt: string;
  artist: string;
  imageID: number;
  quickImage: string;
}

export const defaultImageState = {
  imageState: {
    generatedImages: null,
  },
  setImageState: () => {},
  prompt: '',
  artist: '',
  imageID: 0,
  quickImage: '',
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ImageContext = createContext<ImageContextValue>(defaultImageState);

export const ImageContextProvider = ({ children }: MyContextProviderProps) => {
  const [imageState, setImageState] = useState<ImageState>(
    defaultImageState.imageState
  );

  const [ imageID, setImageID ] = useState<number>(0);
  const [ quickImage, setQuickImage ] = useState<string>('');
  const [ prompt, setPrompt ] = useState<string>('');
  const [ artist, setArtist ] = useState<string>('');
  
  // 

  useEffect(() => {
    console.log(imageState);
  }, [imageState]);

  useEffect(() => {
    if(!imageID) return
    // start polling
  }, [
    imageID,
  ])

  const imageContextValue: ImageContextValue = {
    imageState,
    setImageState,
    prompt,
    artist,
    imageID,
    quickImage,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {children}
    </ImageContext.Provider>
  );
};
