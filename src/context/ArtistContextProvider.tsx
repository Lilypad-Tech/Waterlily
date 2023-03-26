import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { google } from 'googleapis';
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

  //read the artist details from Google Sheets
  const fetchArtistData = async () => {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Define the range of the Google Sheet to read
    const range = 'Sheet1!A3:P';

    const artistData = await sheets.spreadsheets.values.get({
      spreadsheetId: 'YOUR_SPREADSHEET_ID',
      range,
    });
    console.log('artistData', artistData.data.values);
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
