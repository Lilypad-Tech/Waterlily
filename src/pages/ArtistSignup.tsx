import { useState } from 'react';
import {
  Formik,
  useFormikContext,
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
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Chip,
} from '@mui/material';
import {
  ArtistData,
  ArtistCategory,
  ArtistThumbnail,
  ArtistType,
  ArtStyleTags,
  useNavigation,
} from '@/context';
import { HeaderLayout, TitleLayout } from '@/layouts';
import {
  Description,
  Subtitle,
  Title,
  WalletButton,
  ArtistThumbnailUploader,
  ArtistUpload,
} from '@/components';

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
  const { handleNavigation } = useNavigation();
  const [thumbnails, setThumbnails] = useState<ArtistThumbnail[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (newTag: string) => {
    if (!tags.includes(newTag) && newTag.trim() !== '') {
      setTags([...tags, newTag.trim()]);
    }
  };

  const handleChangeTags = (event: any, newTags: string[]) => {
    setTags(newTags);
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleFormSubmit = (values: ArtistData) => {
    console.log(values);
    // do something with the form data, e.g. submit it to a backend API
  };

  return (
    <Box flex="column" sx={{ paddingBottom: '2rem' }}>
      <HeaderLayout>
        <div onClick={() => handleNavigation('/')}>Home</div>
        {/* <Logo height={40} /> */}
        <WalletButton />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle text="Artist Onboarding" />
        <div>Thankyou note here / Link to FAQ </div>
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
              InputProps={{
                endAdornment: (
                  <p
                    style={{
                      fontSize: '12px',
                      position: 'absolute',
                      bottom: '-0.5rem',
                      right: '0.8rem',
                    }}
                  >
                    {formik.values.biography.length}/350
                  </p>
                ),
              }}
              inputProps={{
                maxLength: 350,
              }}
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

            <Autocomplete
              multiple
              freeSolo
              options={ArtStyleTags}
              value={tags}
              onChange={(event, newValue) => {
                if (newValue.length <= 5) {
                  // only set tags if there are 4 or fewer
                  setTags(newValue);
                }
              }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    color="primary"
                    {...getTagProps({ index })}
                    label={option}
                    onDelete={() => handleDeleteTag(option)}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Styles"
                  placeholder={
                    tags.length >= 5
                      ? 'Only 4 tags allowable'
                      : 'Select or add tags'
                  }
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      if (tags.length < 5) {
                        handleAddTag((event.target as HTMLInputElement).value);
                        (event.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  disabled={tags.length >= 4}
                />
              )}
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
            {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '80%' }}>
                <ArtistThumbnailUploader />
              </Box>
            </Box> */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '80%' }}>
                <Typography>Art Thumbnails</Typography>
                <ArtistUpload />
              </Box>
            </Box>

            <Typography>Verification Checks</Typography>
            {/* TODO: refactor to a component */}
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
                sx={{ width: '80%', justifyContent: 'space-between' }}
              />
              <FormControlLabel
                value="legalContent"
                control={<Checkbox />}
                label="Is this art legal content?"
                labelPlacement="start"
                sx={{ width: '80%', justifyContent: 'space-between' }}
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
      <Typography>FAQ's somewhere too</Typography>
    </Box>
  );
};

export default ArtistSignup;
