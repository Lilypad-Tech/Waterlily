import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Fuse from 'fuse.js';

import { getAPIServer } from '../definitions/network';

export const ArtStyleTags = [
  'Surrealism',
  'Abstract',
  'Figurative',
  'Landscape',
  'Japanese',
  'Mythology',
  'Comic Book',
  'Anime',
  'Manga',
  'Vintage',
  'Photography',
  'Illustration',
  'Digital Art',
  'Pop Art',
  'Posters',
  'Indigenous',
  'Classicism',
  'Modern',
  'Oil Painting',
  'Art Deco',
  'Art Nouveau',
  'Cubism',
  'Renaissance',
  'Impressionism',
  'Street Art',
  'Minimalism',
  'Neoclassicism',
  'Neo-Impressionism',
  'Post-Impressionism',
  'Post-Surrealism',
  'Realism',
  'Avant-garde',
  'Baroque',
  'Bauhaus',
  'Conceptual Art',
  'Constructivism',
  'Expressionism',
  'Fauvism',
  'Futurism',
  'Sci-fi',
  'Op-Art',
  'Rococo',
  'Precisionism',
  'Space',
  'Pixel Art',
  'Watercolour',
  'Conceptual',
]; //string of available styles - should be generated from current

export enum ArtistType {
  Private = 'Private',
  Public = 'Public',
}

export type ArtistThumbnail = {
  link: string;
  alt: string;
};

export enum ArtistCategory {
  Classical = 'Classical Art',
  Modern = 'Modern Art',
  PostModern = 'Post-Modern Art',
  Digital = 'Digital Art',
}

export interface ArtistData {
  biography: string;
  artistId?: string; //how do we keep this hidden...
  artistType: ArtistType;
  name: string;
  category: ArtistCategory;
  style: string;
  period: string;
  tags: string[];
  nationality: string;
  description: string;
  portfolio: string;
  thumbnails: ArtistThumbnail[]; //art thumbnails for the artist
  metadata?: { bacalhau_state: string; contract_state: string; error: string };
}

const defaultArtistData: ArtistData = {
  artistId: '',
  artistType: ArtistType.Public,
  name: '',
  category: ArtistCategory.Classical,
  style: '',
  period: '',
  tags: [],
  nationality: '',
  description: '',
  portfolio: '',
  thumbnails: [],
};

export interface Artists {
  publicArtists: ArtistData[];
  privateArtists: ArtistData[];
}

interface ArtistContextValue {
  artistState: ArtistData[];
  setArtistState: Dispatch<SetStateAction<ArtistData[]>>;
  fetchArtistData: () => void;
  findArtistById: (artistId: string) => object;
  getBase64: (file: File) => Promise<string>;
  addWatermark: (imgSrc: string, wmText: string) => Promise<string>;
}

export const defaultArtistState: ArtistContextValue = {
  artistState: [],
  setArtistState: () => {},
  fetchArtistData: () => {},
  findArtistById: () => {
    return {};
  },
  addWatermark: (imgSrc: string, wmText: string) => {
    return {} as Promise<string>;
  },
  getBase64: (file: File) => {
    return {} as Promise<string>;
  },
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ArtistContext =
  createContext<ArtistContextValue>(defaultArtistState);

export const ArtistContextProvider = ({ children }: MyContextProviderProps) => {
  const [artistState, setArtistState] = useState<ArtistData[]>(
    defaultArtistState.artistState
  );

  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
    try {
      const response = await fetch(getAPIServer('/artists'));
      const data = await response.json();
      // console.log('artist data fetched', data);
      let formattedData: ArtistData[] = [];
      data.forEach((item: any) => {
        if (item.bacalhau_state === 'Complete') {
          let thumbs = item.data.thumbnails.map((thumb: string, i: number) => {
            // const newThumb = await addWatermark(thumb, item.name);
            // console.log('thumb', thumb);
            return { link: thumb, alt: `${item.data.name} thumbnail${i}` };
          });
          let tags = item.data.tags.split(',');
          let newItem: ArtistData = {
            ...item.data,
            artistId: item.id,
            metadata: {
              bacalhau_state: item.bacalhau_state,
              contract_state: item.contract_state,
              error: item.error,
            },
            thumbnails: thumbs,
            tags: tags,
          };
          formattedData.push(newItem);
        }
      });
      setArtistState(formattedData);
      console.log('artist data set', formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const findArtistByName = (name: string) => {
    const fuse = new Fuse(artistState, { keys: ['name'] });
    const artistData: any = fuse.search(name);
    console.log('artist data found', artistData);
    return artistData[0].item;
  };

  const findArtistById = (artistId: string) => {
    //search artistState
    const fuse = new Fuse(artistState, { keys: ['artistId'] });
    const artistData: any = fuse.search(artistId);
    console.log('artist data found', artistData);
    return artistData[0].item;
  };

  const addArtistToDB = () => {
    //when we have the page
  };

  const getBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result?.toString();
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const addWatermark = async (imgSrc: string, wmText: string) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imgSrc;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image, 0, 0);

    // Add text watermark
    let text = wmText || 'Waterlily';
    const fontSize = image.height / 12;
    const color = 'rgba(255, 255, 255, 0.8)';
    const outlineColor = 'rgba(0, 0, 0, 0.3)';
    const outlineWidth = 4;

    ctx.font = `${fontSize}px cursive`;
    ctx.fillStyle = color;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth;

    let textWidth = ctx?.measureText(text).width;

    // console.log('textwidth', textWidth, image.width, canvas.width);
    if (textWidth > image.width) {
      const words = wmText.split(' ');
      //KuKula (Nataly Abramovitch)
      console.log('words', words);
      text = words[0];
      if (words[0].length > 20) {
        text = words[0].substring(0, 20);
      }
      textWidth = ctx?.measureText(text).width;
    }

    //position
    const x = image.width / 2 - textWidth / 2;
    const y = fontSize * 1.3; //image.height - fontSize / 2;

    // Add text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;

    ctx?.fillText(text, x, y);
    ctx?.strokeText(text, x, y);
    ctx?.fillText(text, x, y);
    return canvas.toDataURL('image/jpeg');
  };

  const artistContextValue: ArtistContextValue = {
    artistState,
    setArtistState,
    fetchArtistData,
    findArtistById,
    getBase64,
    addWatermark,
  };

  return (
    <ArtistContext.Provider value={artistContextValue}>
      {children}
    </ArtistContext.Provider>
  );
};
