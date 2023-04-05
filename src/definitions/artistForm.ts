import { ArtistCategory, ArtistType } from '@/context';
import * as Yup from 'yup';
import { ethers } from 'ethers';

export interface FormData {
  //Personal Data
  name: string;
  email: string;
  walletAddress: string;
  nationality?: string;
  periodStart: any;
  periodEnd?: any;
  biography: string; //char limited
  //ArtWork Data
  category: ArtistCategory;
  style: string;
  tags?: string[]; //chips
  portfolio: string;
  //verification data
  originalArt: Boolean;
  trainingConsent: Boolean;
  legalContent: Boolean;
  //Images
  avatar?: File[];
  thumbnails: File[]; //up to 3 images, cropped // change this type
  images: File[];
  //Admin
  artistType?: ArtistType;
  artistId?: string; // artistId: string; //need to generate this - should be be passing from FE or just generate in DB?
}

export const initialFormValues: FormData = {
  // artistId: '', //gets created on form input and validation
  //Personal Data
  // artistType: ArtistType.Private, //need to toggle this for admin uploads
  name: '',
  email: '',
  walletAddress: '',
  nationality: '',
  biography: '',
  avatar: [],
  //ArtWork Data
  category: '' as ArtistCategory, //empty really
  style: '',
  tags: [],
  periodStart: new Date(2000, 0, 1),
  periodEnd: new Date(), //new Date().getFullYear().toString(),
  portfolio: '', //link to portfolio
  thumbnails: [], //up to 5 images, best 668x504 =
  //verification data
  originalArt: false,
  trainingConsent: false,
  legalContent: false,
  images: [], //send elsewhere
  //admin only
  artistType: 'Private' as ArtistType,
  artistId: '',
};

export const ethereumAddressValidator = (message?: string) => {
  return Yup.string().test(
    'is-ethereum-address',
    message || 'Invalid Ethereum address',
    (value) => {
      return ethers.utils.isAddress(value || '');
    }
  );
};

export const formValidationSchema: Yup.ObjectSchema<FormData> =
  Yup.object().shape({
    //Personal Data
    name: Yup.string()
      .required('Required')
      .min(3, 'Name must be at least 3 characters long'),
    email: Yup.string().email('Must be a valid email').required('Required'),
    walletAddress: Yup.string().required('Required'),
    nationality: Yup.string().optional(), //opt
    biography: Yup.string()
      .required('Required')
      .min(120, 'You have more to say, surely!')
      .max(350, 'No more than 350 characters will be displayed'),
    avatar: Yup.array<File>().optional(), //opt
    //ArtWork Data
    category: Yup.string<ArtistCategory>().required('Required'),
    tags: Yup.array().optional(), //opt
    style: Yup.string().required('Required'),
    periodStart: Yup.date()
      .min(new Date(1200, 0, 1))
      .max(new Date(), 'Date is in the future')
      .required('Period Start is required'),
    periodEnd: Yup.date()
      .max(new Date(), 'Date is in the future')
      .required('Period End is required'), //default = "2023 date"
    portfolio: Yup.string().url().required('Required'),
    thumbnails: Yup.array<File>()
      .required('Required')
      .min(1, 'At least one thumbnail image required'),
    //Verification data
    originalArt: Yup.boolean().oneOf([true]).required(),
    trainingConsent: Yup.boolean().oneOf([true]).required(),
    legalContent: Yup.boolean().oneOf([true]).required(),
    images: Yup.array<File>()
      .required('Required')
      .min(30, 'At least 50 unique images required to train'),
    //Admin (if walletAddress === Lilypad "0x5617493b265E9d3CC65CE55eAB7798796D9108E4")
    artistType: Yup.string<ArtistType>(),
    artistId: Yup.string(),
  });

export const formStepSections = [
  'Personal Information',
  'Art Information',
  'Upload & Verify',
];

export const formStepSectionValues: { [key: string]: string[] } = {
  values0: [
    'name',
    'email',
    'walletAddress',
    'nationality',
    'biography',
    'avatar',
  ],
  values1: [
    'category',
    'tags',
    'style',
    'periodStart',
    'periodEnd',
    'portfolio',
    'thumbnails',
  ],
  values2: ['images', 'originalArt', 'trainingConsent', ' legalContent'],
};
