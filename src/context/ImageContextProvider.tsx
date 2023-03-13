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
  imagePrompt: string;
  imageArtist: { name: string; key: string; style: string };
  setImagePrompt: Dispatch<SetStateAction<string>>;
  setImageArtist: React.Dispatch<React.SetStateAction<{
    name: string;
    key: string;
    style: string;
  }>>;
  imageID: number;
  setImageID: Dispatch<SetStateAction<number>>;
  quickImages: string[];
}

const IMAGE_HOST = `https://ai-art-files.cluster.world`

export const getQuickImageURL = (jobID: number, imageIndex: number) => {
  return `${IMAGE_HOST}/job/${jobID}/image_${imageIndex}.png`;
}

export const defaultImageState: ImageContextValue = {
  imageState: {
    generatedImages: null,
  },
  setImageState: () => {},
  imagePrompt: '',
  imageArtist: {name: '', key: '', style: ''},
  imageID: 0,
  quickImages: [],
  setImageArtist: () => {},
  setImagePrompt: () => {},
  setImageID: () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ImageContext = createContext<ImageContextValue>(defaultImageState);

export const ImageContextProvider = ({ children }: MyContextProviderProps) => {
  const [imageState, setImageState] = useState<ImageState>(
    defaultImageState.imageState
  );

  const [imageID, setImageID] = useState<number>(0);
  const [quickImages, setQuickImages] = useState<string[]>([]);
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageArtist, setImageArtist] = useState<{ name: string; key: string; style: string }>({name: '', key: '', style: ''});

  useEffect(() => {
    console.log(imageState);
  }, [imageState]);

  useEffect(() => {
    if (!imageID) return;

    // now we start polling for our images

    console.log('--------------------------------------------')
    console.log('HERE')
    setQuickImages([
      getQuickImageURL(54, 0)
    ])

  }, [imageID]);

  const imageContextValue: ImageContextValue = {
    imageState,
    setImageState,
    imagePrompt,
    imageArtist,
    imageID,
    quickImages,
    setImagePrompt,
    setImageArtist,
    setImageID,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {children}
    </ImageContext.Provider>
  );
};
