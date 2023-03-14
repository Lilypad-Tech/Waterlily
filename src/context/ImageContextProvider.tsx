import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react';
import bluebird from 'bluebird';
import { ethers } from 'ethers';
import { StatusContext } from '.';

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
  setImageArtist: React.Dispatch<
    React.SetStateAction<{
      name: string;
      key: string;
      style: string;
    }>
  >;
  imageID: number;
  setImageID: Dispatch<SetStateAction<number>>;
  quickImages: string[];
}

export const IMAGE_HOST = `https://ai-art-files.cluster.world`;
export const IMAGE_COUNT = 4;

export const getQuickImageURL = (jobID: number, imageIndex: number) => {
  return `${IMAGE_HOST}/job/${jobID}/image_${imageIndex}.png`;
};

export const defaultImageState: ImageContextValue = {
  imageState: {
    generatedImages: null,
  },
  setImageState: () => {},
  imagePrompt: '',
  imageArtist: { name: '', key: '', style: '' },
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

export const convertBlobToBase64 = (blob: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

export const ImageContextProvider = ({ children }: MyContextProviderProps) => {
  const [imageState, setImageState] = useState<ImageState>(
    defaultImageState.imageState
  );

  const [imageID, setImageID] = useState<number>(0);
  const [quickImages, setQuickImages] = useState<string[]>([]);
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageArtist, setImageArtist] = useState<{
    name: string;
    key: string;
    style: string;
  }>({ name: '', key: '', style: '' });

  const { setStatusState } = useContext(StatusContext);

  useEffect(() => {
    console.log(imageState);
  }, [imageState]);

  useEffect(() => {
    if (!imageID) return;
    let active = true;
    let loaded = false;
    let urls: string[] = [];

    for (var i = 0; i < IMAGE_COUNT; i++) {
      const imageUrl = getQuickImageURL(imageID, i);
      if (!quickImages.find((url) => url === imageUrl)) {
        urls.push(imageUrl);
      }
    }

    const doAsync = async () => {
      while (!loaded) {
        const newURLs = (await bluebird.map(urls, async (url, i) => {
          try {
            const res = await fetch(url);
            console.log(`url: ${url} ${res.status}`);
            if (res.status != 200) return '';
            return url;
          } catch (err) {
            return '';
          }
        })) as string[];

        const filteredURLs = newURLs.filter((u) => u);

        if (filteredURLs.length >= IMAGE_COUNT) {
          setQuickImages(filteredURLs);
          loaded = true;
          setStatusState({
            isLoading: '',
            isError: '',
            isMessage: true,
            message: {
              title: 'Images Created!',
              description: `Images for prompt: ${imagePrompt} created!`,
            },
          });
          break;
        }
        await bluebird.delay(1000);
      }
    };

    doAsync();

    return () => {
      active = false;
    };
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
