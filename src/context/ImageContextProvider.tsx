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
import * as FileSaver from 'file-saver';
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
  twitterLink: any;
  setImageID: Dispatch<SetStateAction<number>>;
  quickImages: string[];
  setQuickImages: Dispatch<SetStateAction<string[]>>;
  downloadImage: (imageUrl: string, folderName: string, fileName: string) => {};
  resetAllImageContext: () => void;
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
  twitterLink: '',
  setImageArtist: () => {},
  setImagePrompt: () => {},
  setImageID: () => {},
  setQuickImages: () => {},
  downloadImage: async () => {},
  resetAllImageContext: () => {},
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
  const [twitterLink, setTwitterLink] = useState<string>('');

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
          createTwitterLink(filteredURLs[2]);
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

  // const createTwitterLink = async () => {
  //   const tweetText = `Check out the ethical AI art I created on waterlily.ai! \n\n✍️ ${imagePrompt} \n\n🎨 ${imageArtist.name} \n\n`;
  //   const response = await fetch(quickImages[0]);
  //   const imageBlob = await response.blob();
  //   const reader = new FileReader();
  //   reader.readAsArrayBuffer(imageBlob);
  //   return new Promise((resolve) => {
  //     reader.onloadend = () => {
  //       const buf = reader.result as ArrayBuffer;
  //       const base64String = buf ? Buffer.from(buf).toString('base64') : '';
  //       const tweetImageUrl = `https://example.com/images/my-image.jpg`;
  //       const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  //         tweetText
  //       )}&url=${encodeURIComponent(tweetImageUrl)}`;
  //       resolve(tweetUrl);
  //     };
  //   }).then((tweetUrl) => {
  //     const url = tweetUrl as string;
  //     setTwitterLink(url);
  //   });
  // };

  const createTwitterLink = async (url: string) => {
    const tweetText = `Check out the ethical AI art I created on waterlily.ai! \n\n✍️ ${imagePrompt} \n\n🎨 ${imageArtist.name} \n\n`;
    // const response = await fetch(quickImages[2]);
    // const imageBlob = await response.blob();
    // const base64String = await convertBlobToBase64(imageBlob);
    // const tweetImageUrl = `data:${imageBlob.type};base64,${base64String}`;
    // const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    //   tweetText
    // )}&url=${encodeURIComponent(tweetImageUrl)}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(url)}`;
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
    setImagePrompt('');
    setImageArtist({ name: '', key: '', style: '' });
    setTwitterLink('');
  };

  const imageContextValue: ImageContextValue = {
    imageState,
    setImageState,
    imagePrompt,
    imageArtist,
    imageID,
    quickImages,
    setQuickImages,
    setImagePrompt,
    setImageArtist,
    setImageID,
    downloadImage,
    twitterLink,
    resetAllImageContext,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {children}
    </ImageContext.Provider>
  );
};
