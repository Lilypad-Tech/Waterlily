import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import fetchArtists from '../pages/api/fetchArtists';
// import { google } from 'googleapis';
// import { Fireproof } from '@fireproof/core';

enum ArtistType {
  Private = 'private',
  Public = 'public',
}

type ArtistThumbnail = {
  link: string;
  alt: string;
};

export interface ArtistData {
  artistId: string; //how do we keep this hidden...
  artistType: ArtistType;
  name: string;
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
  style: '',
  period: '',
  tags: [],
  nationality: '',
  description: '',
  portfolio: '',
  thumbnails: [],
};

export interface ArtistState {
  artists: ArtistData[];
}

interface ArtistContextValue {
  artistState: ArtistState;
  setArtistState: Dispatch<SetStateAction<ArtistState>>;
  fetchArtistData: () => void;
}

export const defaultArtistState: ArtistContextValue = {
  artistState: { artists: [] },
  setArtistState: () => {},
  fetchArtistData: () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const ArtistContext =
  createContext<ArtistContextValue>(defaultArtistState);

export const ArtistContextProvider = ({ children }: MyContextProviderProps) => {
  const [artistState, setArtistState] = useState<ArtistState>(
    defaultArtistState.artistState
  );

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await fetch('/api/fetchArtists');
        const data = await response.json();
        console.log('artists', data);
        // setArtistData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArtistData();
  }, []);

  //read the artist details from Google Sheets
  const fetchArtistData = async () => {
    // const artistData = await fetchArtists();
    // console.log('artist data', artistData);
    // const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    // if (!API_KEY) return;
    // const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    // // Define the range of the Google Sheet to read
    // const range = 'Sheet1!B3:P9';
    // const spreadsheetId = '1q2bJT9fULFavXyB9XDO8TNBpWwvHHBNbCikfxfYN3zU';
    // //https:docs.google.com/spreadsheets/d/1q2bJT9fULFavXyB9XDO8TNBpWwvHHBNbCikfxfYN3zU/edit#gid=0
    // const artistData = await sheets.spreadsheets.values.get({
    //   spreadsheetId,
    //   range,
    //   key: API_KEY,
    // });
    // console.log('artistData', artistData.data.values);
  };

  const addArtistToDB = () => {
    //when we have the page
  };

  const artistContextValue: ArtistContextValue = {
    artistState,
    setArtistState,
    fetchArtistData,
  };

  return (
    <ArtistContext.Provider value={artistContextValue}>
      {children}
    </ArtistContext.Provider>
  );
};
