import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Fuse from 'fuse.js';
// import fetchArtists from '../pages/api/fetchArtists';
// import { google } from 'googleapis';
// import { Fireproof } from '@fireproof/core';

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
  'Realism',
  'Avant-garde',
  'Baroque',
  'Bauhaus',
  'Conceptual Art',
  'Constructivism',
  'Cubism',
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
  artistId: string; //how do we keep this hidden...
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
}

export const defaultArtistState: ArtistContextValue = {
  artistState: [],
  setArtistState: () => {},
  fetchArtistData: () => {},
  findArtistById: () => {
    return {};
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
      const response = await fetch('/api/fetchArtists');
      const data = await response.json();
      setArtistState(data);
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

  const artistContextValue: ArtistContextValue = {
    artistState,
    setArtistState,
    fetchArtistData,
    findArtistById,
  };

  return (
    <ArtistContext.Provider value={artistContextValue}>
      {children}
    </ArtistContext.Provider>
  );
};
