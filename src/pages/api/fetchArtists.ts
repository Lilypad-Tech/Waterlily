import type { NextApiRequest, NextApiResponse } from 'next';

import { google } from 'googleapis';
import {
  ArtistData,
  ArtistCategory,
  ArtistThumbnail,
  ArtistType,
} from '../../definitions/artists';

const spreadsheetId = '1q2bJT9fULFavXyB9XDO8TNBpWwvHHBNbCikfxfYN3zU';
const range = 'Sheet1!A3:P9';

async function fetchData(apiKey: string): Promise<any[]> {
  const sheets = google.sheets({ version: 'v4', auth: apiKey });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  console.log('artists', result.data.values);
  return result.data.values as any[];
}

function createArtistData(row: any[]): ArtistData {
  console.log('artists rows', row);
  const artistId = row[4];
  const artistType =
    row[3] === 'Public' ? ArtistType.Public : ArtistType.Private;
  const name = row[1];
  const category = row[12] as ArtistCategory;
  const style = row[13];
  const artLink = row[6];
  const thumbnailLinks = row[9] ? row[9].split(',') : [];
  const thumbnailAlts = row[10] ? row[10].split(',') : [];
  const thumbnails: ArtistThumbnail[] = thumbnailLinks.map((link, i) => ({
    link,
    alt: thumbnailAlts[i] || '',
  }));
  const description = row[7];
  const portfolio = row[8];
  const period = row[14];
  const tags = row[15] ? row[15].split(',') : [];
  const nationality = row[16];
  return {
    artistId,
    artistType,
    name,
    category,
    style,
    thumbnails,
    description,
    portfolio,
    period,
    tags,
    nationality,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).send('API key not found.');
  }

  const rows = await fetchData(apiKey);
  console.log('rows', rows);

  const artistData: ArtistData[] = rows.map((row) => createArtistData(row));
  console.log('artists data', artistData);

  res.status(200).json(artistData);
}
