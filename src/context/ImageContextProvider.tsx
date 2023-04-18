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
import { NFTStorage } from 'nft.storage';
import { Web3Storage } from 'web3.storage';
import {
  NetworkContext,
  StatusContext,
  WalletContext,
  defaultStatusState,
  defaultWalletState,
  ArtistContext,
  ArtistData,
} from '.';
import { getAPIServer } from '../definitions/network';
import { TokenInput } from 'nft.storage/dist/src/token';

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

interface NFTProperties {
  type: string;
  prompt: string;
  originalArtist: {
    name: string;
  };
  imageID: number;
  origins: {
    ipfs: string;
  };
  mintedBy: string;
}

export interface NFTMetadata extends TokenInput {
  properties: NFTProperties;
}

export interface NFTJson extends TokenInput {
  name: string;
  description: string;
  image: any; //,image.link, //should be a Blob - need to make it
  properties: {
    type: string;
    prompt: string;
    originalArtist: ArtistData | {};
    imageID: number;
    origins: {
      ipfs: string; //original bacalhau ipfs link... hmm where to get this
      img: { link: string; alt: string };
    };
    mintedBy: string;
  };
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
  nftMetadata: any;
  saveToNFTStorage: (image: { link: string; alt: string }) => Promise<any>;
  createArtistId: (values: any) => Promise<string>;
}

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
  nftMetadata: null,
  saveToNFTStorage: (image: { link: string; alt: string }) => {
    return {} as Promise<any>;
  },
  createArtistId: (values: any) => {
    return {} as Promise<string>;
  },
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ImageContext = createContext<ImageContextValue>(defaultImageState);

export const ImageContextProvider = ({ children }: MyContextProviderProps) => {
  const { network } = useContext(NetworkContext);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { setStatusState, setSnackbar } = useContext(StatusContext);
  const { findArtistById } = useContext(ArtistContext);

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
  const [nftMetadata, setNftMetadata] = useState<any>('');

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
    const base = getAPIServer(`/files/generated_images/${jobID}`);
    if (imageIndex < 0) return `${base}/combined.jpg`;
    return `${base}/image_${imageIndex}.png`;
  };

  const getImageBlob = async (
    imageHTTPURL: string // this is the imageHTTPURL will just be ipfs://cid for normal image
  ) => {
    const r = await fetch(imageHTTPURL);
    console.log('r', r);
    if (!r.ok) {
      // throw new Error(`error fetching image: [${r.statusText}]: ${r.status}`);
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'Could not fetch the image',
      });
    }
    return r.blob();
  };

  const getNFTStorageClient = () => {
    return new NFTStorage({
      token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || 'undefined',
    });
  };

  const getWeb3StorageClient = () => {
    return new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY || 'undefined',
    });
  };

  //we know the prompt, artist, jobID & image url.
  const createNFTMetadata = async (image: { link: string; alt: string }) => {
    //fetch artist details here
    //get the image blob
    let imageBlob = await getImageBlob(image.link);
    // let ipfsImageBlob = await NFTStorageClient.storeBlob(imageBlob)
    if (!imageBlob) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError:
          'Something went wrong downloading the image for storing to NFT.Storage',
      });
      return;
    }

    //fetch artist details...
    const artistData: ArtistData | null = findArtistById(imageArtist.key);
    if (artistData) {
      console.log('artistData in image context', artistData);
      const origArtist =
        Object.keys(artistData).length > 0
          ? artistData
          : { name: imageArtist.name, artistId: imageArtist.key };

      const nftJson: NFTJson = {
        name: 'Waterlily Ethical AI NFTs',
        description: `This NFT created by Waterlily.ai from artwork trained on artworks by ${imageArtist.name}. Creators are paid for every use of their artwork on waterlily.ai. Be part of the change.`,
        image: imageBlob, //,image.link, //should be a Blob - need to make it
        properties: {
          type: `Stable Diffusion Ethical AI-generated image by Waterlily.ai`,
          prompt: imagePrompt,
          originalArtist: origArtist,
          imageID: imageID,
          origins: {
            ipfs: ``, //original bacalhau ipfs link... hmm where to get this
            img: image,
          },
          mintedBy: walletState?.accounts[0] || '',
        },
      };
      return nftJson;
    }
    return;
  };

  const saveToNFTStorage = async (image: { link: string; alt: string }) => {
    const NFTStorageClient: NFTStorage = getNFTStorageClient();
    if (!NFTStorageClient) {
      console.log('No nft.storage client');
      return;
    }
    setStatusState({
      ...defaultStatusState.statusState,
      isLoading: 'Creating & Storing NFT Metadata to NFT.Storage...',
    });
    let nftJson: NFTJson | undefined = await createNFTMetadata(image);
    console.log('created nft metadata', nftJson);
    if (!nftJson) {
      setStatusState({
        ...defaultStatusState.statusState,
        isError:
          'Something went wrong creating the NFT metadata for storing to NFT.Storage',
      });
    }
    if (nftJson) {
      let ipfsImageBlob = await NFTStorageClient.storeBlob(nftJson.image);
      nftJson.properties.origins.ipfs = ipfsImageBlob;
      console.log('stored blob', nftJson);
      //setStatus here to loading
      const metadata = await NFTStorageClient.store(nftJson)
        .then((metadata) => {
          console.log('NFT Data pinned to IPFS & stored on Filecoin');
          console.log('Metadata URI:', metadata.url, metadata);
          setStatusState((prevState) => ({
            ...prevState,
            isLoading: 'Sending to minting function - check your wallet!', //'NFT Metadata successfully saved to NFT.Storage!',
            isMessage: true,
            message: {
              title: `NFT Metadata successfully saved to NFT.Storage!`,
              description: (
                <a href={metadata.url} target="_blank" rel="no_referrer">
                  {metadata.url}
                </a>
              ),
            },
          }));

          setNftMetadata(metadata);
          return metadata;
          //mint the NFT now
        })
        .catch((err) => {
          console.log('Error uploading to NFT.storage', err);
          setStatusState({
            ...defaultStatusState.statusState,
            isError:
              'Something went wrong saving the NFT metadata to NFT.Storage',
          });
          throw err;
        });
      return metadata;
    }
  };

  const createArtistId = async (values: {
    [key: string]: any;
    name: string;
  }) => {
    const Web3StorageClient: Web3Storage = getWeb3StorageClient();
    if (!Web3StorageClient) {
      console.log('No web3.storage client');
      setStatusState({
        ...defaultStatusState.statusState,
        isError: 'No storage client found',
      });
      setSnackbar({
        type: 'error',
        open: true,
        message: 'No web3.storage client found',
      });
      return '';
    }
    try {
      setStatusState({
        ...defaultStatusState.statusState,
        isLoading: `Creating ${values.name} artist identifier on IPFS`,
      });
      const blob = new Blob([JSON.stringify(values)]);
      if (!blob) throw new Error('Error creating blob for artistId');
      const file = [new File([blob], `${values?.name}.json`)];
      if (!file) throw new Error('Error creating file for artistId');
      console.log('file', file);
      const cid = await Web3StorageClient.put(file);
      if (!cid) throw new Error('Error creating artistId');
      setStatusState({
        ...defaultStatusState.statusState,
      });
      setSnackbar({
        type: 'success',
        open: true,
        message: 'Created Artist id successfully',
      });
      return cid;
    } catch (err: any) {
      console.log('web3storage error', err);
      setStatusState({
        ...defaultStatusState.statusState,
        isError: err?.message || 'No storage client found',
      });
      setSnackbar({
        type: 'error',
        open: true,
        message: err.message || 'No storage client found',
      });
      return '';
    }
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
    nftMetadata,
    saveToNFTStorage,
    createArtistId,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {children}
    </ImageContext.Provider>
  );
};
