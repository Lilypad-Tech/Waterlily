import type { NextApiRequest, NextApiResponse } from 'next';

import { google } from 'googleapis';
import {
  ArtistData,
  ArtistCategory,
  ArtistThumbnail,
  ArtistType,
} from '@/context';

const spreadsheetId = '1q2bJT9fULFavXyB9XDO8TNBpWwvHHBNbCikfxfYN3zU';
const range = 'Sheet1!A4:P10';

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
  // 0 Needs Validation
  // 1 Name
  // 2 priority
  // 3 artistType
  // 4 artistId
  // 5 dockerModel
  // 6 artLink
  // 7 portfolio
  // 8 description
  // 9 thumbnails
  // 10 thumnailAlt
  // 11 category
  // 12 style
  // 13 period
  // 14 tags
  // 15 nationality
  const name = row[1];
  const artistType =
    row[3] === 'Public' ? ArtistType.Public : ArtistType.Private;
  const artistId = row[4];
  const portfolio = row[7];
  const description = row[8];
  const thumbnailLinks = row[9] ? row[9].split(',') : [];
  const thumbnailAlts = row[10] ? row[10].split(',') : [];
  const thumbnails: ArtistThumbnail[] = thumbnailLinks.map(
    (link: string, i: number) => ({
      link,
      alt: thumbnailAlts[i] || '',
    })
  );
  const category = row[11] as ArtistCategory;
  const style = row[12];
  const period = row[13] ? row[13] : 'Current';
  const tags = row[14] ? row[14].split(',') : [];
  const nationality = row[15];
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
