import { useState } from 'react';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  MenuItem,
  TextareaAutosize,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  ArtistData,
  ArtistCategory,
  ArtistThumbnail,
  ArtistType,
} from '@/context';
import { HeaderLayout, TitleLayout } from '@/layouts';
import { Description, Subtitle, Title, WalletButton } from '@/components';

interface FormData {
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
}

const initialValues: FormData = {
  // artistId: '', //gets created on form input and validation
  //Personal Data
  artistType: ArtistType.Private,
  name: '',
  email: '',
  walletAddress: '',
  nationality: '',
  period: '',
  biography: '',
  //ArtWork Data
  category: ArtistCategory.Modern, //empty really
  style: '',
  tags: [],
  portfolio: '', //link to portfolio
  //verification data
  originalArt: false,
  trainingConsent: false,
  legalContent: false,
  //images
  avatar: '',
  thumbnails: [], //up to 3 images, cropped
  images: '',
};

const validationSchema = Yup.object().shape({
  //Personal Data
  name: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
  walletAddress: Yup.string().required('Required'),
  nationality: Yup.string(),
  period: Yup.string().required('Required'),
  biography: Yup.string().required('Required'),
  //ArtWork Data
  category: Yup.string().required('Required'),
  style: Yup.string().required('Required'),
  tags: Yup.array(),
  portfolio: Yup.string().url().required('Required'),
  //Verification data
  originalArt: Yup.boolean(),
  trainingConsent: Yup.boolean(),
  legalContent: Yup.boolean(),
  //Images
  // avatar:
  // thumbnails:
  // images:
});

const onSubmit = (values: FormData) => {
  console.log(values);
  // You can send form data to a backend API or handle it in any way you want
};
const categoryOptions = Object.values(ArtistCategory).map((category) => (
  <option key={category} value={category}>
    {category}
  </option>
));

const artistTypeOptions = Object.values(ArtistType).map((artistType) => (
  <option key={artistType} value={artistType}>
    {artistType}
  </option>
));

// const handleThumbnailChange =
//   (setFieldValue: (field: string, value: any) => void, index: number) =>
//   (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Upload and crop the image using the library of your choice
//       // and then set the thumbnail using setFieldValue
//       setFieldValue(`thumbnails[${index}]`, { link: '', alt: '' });
//     }
//   };

const ArtistSignup: React.FC<{}> = () => {
  const [thumbnails, setThumbnails] = useState<ArtistThumbnail[]>([]);

  const handleFormSubmit = (values: ArtistData) => {
    console.log(values);
    // do something with the form data, e.g. submit it to a backend API
  };
  return (
    <Box flex="column">
      <HeaderLayout>
        <div>Home</div>
        {/* <Logo height={40} /> */}
        <WalletButton />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle text="Artist Onboarding" />
        <div>Thankyou note here</div>
      </TitleLayout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '80%' },
              padding: '1rem',
            }}
          >
            {/* most of these fields the same. Just map it */}
            <Typography>Personal Details</Typography>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              id="walletAddress"
              name="walletAddress"
              label="Wallet Address"
              variant="outlined"
              fullWidth
              value={formik.values.walletAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.walletAddress &&
                Boolean(formik.errors.walletAddress)
              }
              helperText={
                formik.touched.walletAddress && formik.errors.walletAddress
              }
            />
            <TextField
              id="nationality"
              name="nationality"
              label="Nationality"
              placeholder="Optional: Your Nationality"
              variant="outlined"
              fullWidth
              value={formik.values.nationality}
              onChange={formik.handleChange}
              error={
                formik.touched.nationality && Boolean(formik.errors.nationality)
              }
              helperText={
                formik.touched.nationality && formik.errors.nationality
              }
            />
            <TextField
              id="biography"
              name="biography"
              label="Biography"
              placeholder="Your biography"
              variant="outlined"
              fullWidth
              multiline
              value={formik.values.biography}
              onChange={formik.handleChange}
              error={
                formik.touched.biography && Boolean(formik.errors.biography)
              }
              helperText={formik.touched.biography && formik.errors.biography}
            />

            <Typography>Artwork Details</Typography>
            <TextField
              id="category"
              name="category"
              label="Category"
              variant="outlined"
              fullWidth
              select
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            >
              {Object.values(ArtistCategory).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="style"
              name="style"
              label="Style"
              variant="outlined"
              fullWidth
              value={formik.values.style}
              onChange={formik.handleChange}
              error={formik.touched.style && Boolean(formik.errors.style)}
              helperText={formik.touched.style && formik.errors.style}
            />

            {/* put a year drop down in. */}
            <TextField
              id="period"
              name="period"
              label="Period"
              placeholder="Enter your artwork dates"
              variant="outlined"
              fullWidth
              value={formik.values.period}
              onChange={formik.handleChange}
              error={formik.touched.period && Boolean(formik.errors.period)}
              helperText={formik.touched.period && formik.errors.period}
            />

            <TextField
              id="portfolio"
              name="portfolio"
              label="Portfolio"
              placeholder="Enter your portfolio link"
              variant="outlined"
              fullWidth
              value={formik.values.portfolio}
              onChange={formik.handleChange}
              error={
                formik.touched.portfolio && Boolean(formik.errors.portfolio)
              }
              helperText={formik.touched.portfolio && formik.errors.portfolio}
            />
            <Typography>Images</Typography>

            <Typography>Verification Checks</Typography>
            <Box sx={{ justifyContent: 'left' }}>
              <FormControlLabel
                value="originalArt"
                control={<Checkbox />}
                label="Is your art your own original work?"
                labelPlacement="start"
                sx={{ width: '80%', justifyContent: 'space-between' }}
              />
              <FormControlLabel
                value="trainingConsent"
                control={<Checkbox />}
                label="Do you consent to having a Machine Learning Model trained on your artworks?"
                labelPlacement="start"
              />
              <FormControlLabel
                value="legalContent"
                control={<Checkbox />}
                label="Is this art legal content?"
                labelPlacement="start"
              />
            </Box>

            <Box sx={{ width: '100%', padding: '1rem' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default ArtistSignup;
