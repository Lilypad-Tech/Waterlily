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
import FileSaver from 'file-saver';
import { NetworkContext, StatusContext, NetworkDataType } from '.';

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
  twitterLink: any;
  setImageID: Dispatch<SetStateAction<number>>;
  quickImages: string[];
  setQuickImages: Dispatch<SetStateAction<string[]>>;
  downloadImage: (imageUrl: string, folderName: string, fileName: string) => {};
  resetAllImageContext: () => void;
  createTwitterLink: (imageUrl: string) => void;
  getQuickImageURL: (jobID: number, imageIndex: number) => string;
}

// export const IMAGE_HOST = `https://ai-art-files.cluster.world`;
export const IMAGE_COUNT = 4;
export const IMAGE_NUMBER_ARRAY: number[] = [0, 1, 2, 3];
// export const IMAGE_URL_ROOT = `${IMAGE_HOST}/job/314-`;

// export const getQuickImageURL = (jobID: number, imageIndex: number) => {
//   if (imageIndex < 0) return `${IMAGE_HOST}/job/${jobID}/combined.jpg`;
//   return `${IMAGE_HOST}/job/${jobID}/image_${imageIndex}.png`;
// };

export const defaultImageState: ImageContextValue = {
  imageState: {
    generatedImages: null,
  },
  setImageState: () => {},
  imagePrompt: '',
  imageArtist: { name: '', key: '', style: '' },
  imageID: 0,
  quickImages: [],
  twitterLink: '',
  setImageArtist: () => {},
  setImagePrompt: () => {},
  setImageID: () => {},
  setQuickImages: () => {},
  downloadImage: async () => {},
  resetAllImageContext: () => {},
  createTwitterLink: (url: string) => {
    return '';
  },
  getQuickImageURL: (jobID: number, imageIndex: number) => {
    return '';
  },
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ImageContext = createContext<ImageContextValue>(defaultImageState);

export const ImageContextProvider = ({ children }: MyContextProviderProps) => {
  const { network } = useContext(NetworkContext);
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
  const [twitterLink, setTwitterLink] = useState<string>('');

  const { setStatusState } = useContext(StatusContext);

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

    urls.push(getQuickImageURL(imageID, -1));

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
          console.log('last image', filteredURLs[4]);
          createTwitterLink(filteredURLs[4]);
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

  const createTwitterLink = (url: string) => {
    const tweetText = `Check out the ethical AI art I created on waterlily.ai! \n\n✍️ ${imagePrompt} \n\n🎨 ${imageArtist.name} -> 💸 0.09 $FIL paid \n\n❤️ Powered by @BacalhauProject and @Filecoin\n\n`;
    // const endTweetText = `\n\nPowered by @BacalhauProject and @Filecoin\n\n`;
    const tweetUrl: string = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(url)}`; //&text=${encodeURIComponent(endTweetText)}`;

    setTwitterLink(tweetUrl);
  };

  const downloadImage = async (
    imageUrl: string | undefined,
    fileName: string,
    folderName?: string
  ) => {
    if (!imageUrl) return;
    fetch(imageUrl)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        FileSaver.saveAs(blob, `WaterlilyAI_${folderName}_${fileName}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resetAllImageContext = () => {
    //reset all vars here needed
    setImageState(defaultImageState.imageState);
    setImageID(0);
    setQuickImages([]);
    // setImagePrompt('');
    // setImageArtist({ name: '', key: '', style: '' });
    setTwitterLink('');
  };

  const getQuickImageURL = (jobID: number, imageIndex: number) => {
    if (imageIndex < 0) return `${network.imageUrlRoot}${jobID}/combined.jpg`;
    return `${network.imageUrlRoot}${jobID}/image_${imageIndex}.png`;
  };

  const imageContextValue: ImageContextValue = {
    imageState,
    setImageState,
    imagePrompt,
    imageArtist,
    imageID,
    quickImages,
    twitterLink,
    setQuickImages,
    setImagePrompt,
    setImageArtist,
    setImageID,
    downloadImage,
    resetAllImageContext,
    createTwitterLink,
    getQuickImageURL,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {children}
    </ImageContext.Provider>
  );
};
