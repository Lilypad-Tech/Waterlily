import { useRouter } from 'next/router';
import React from 'react';
import HomePage from './HomePage';
import ArtistSignup from './ArtistSignup';

//I think my context's maybe shouldn't have children
export default function Home() {
  const router = useRouter();
  return (
    <>
      {/* <WebHeader />
      <PageLayout> */}
      {router.pathname === '/' && <HomePage />}
      {router.pathname === '/ArtistSignup' && <ArtistSignup />}
      {/* </PageLayout> */}
    </>
  );
}

/*
  // artistId: string; //how do we keep this hidden...
  //Personal Data
  artistType: ArtistType;
  name: string;
  email: string;
  walletAddress: string;
  nationality?: string;
  period: string;
  biography: string; //char limited
  //ArtWork Data
  category: ArtistCategory;
  style: string;
  tags: string[]; //chips
  portfolio: string;
  //verification data
  originalArt: Boolean;
  trainingConsent: Boolean;
  legalContent: Boolean;
  //Images
  avatar: '';
  thumbnails: ArtistThumbnail[]; //up to 3 images, cropped // change this type
  images: '';


*/
