import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import bluebird from 'bluebird'
import axios from 'axios'
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
const IMAGE_COUNT = 4

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
    let active = true;
    let loaded = false;
    let urls: string[] = [];
    let loadedUrls: string[] = [];

    for(var i=0; i<IMAGE_COUNT; i++) {
      const imageUrl = getQuickImageURL(imageID, i)
      if(!quickImages.find(url => url === imageUrl)) {
        urls.push(imageUrl)
      }
    }

    const tryImages = async () => {
      await bluebird.each(urls, async (url, i) => {
        try {
          await fetch(url, {method: 'HEAD'})
          loadedUrls[i]  = url
          urls = urls.filter(u => u !== url)
          setQuickImages(loadedUrls.filter(u => !!u))
        } catch (err) {}
      })
    }

    const doAsync = async () => {
      while(!loaded && active) {
        await tryImages()
        if(quickImages.length >= IMAGE_COUNT) {
          loaded = true
          break
        }
        await bluebird.delay(1000)
      }
    }

    doAsync()

    return () => {
      active = false;
    }
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
