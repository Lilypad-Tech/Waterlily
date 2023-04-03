import { Fragment, useEffect, useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Tooltip,
} from '@mui/material';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
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
  periodStart: string;
  periodEnd: string;
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
  periodStart: '',
  periodEnd: '',
  biography: '',
  //ArtWork Data
  category: ArtistCategory.PostModern, //empty really
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
  periodStart: Yup.string().required('Required'),
  periodEnd: Yup.string(),
  biography: Yup.string().required('Required'),
  //ArtWork Data
  category: Yup.string().required('Required'),
  style: Yup.string().required('Required'),
  tags: Yup.array(),
  portfolio: Yup.string().url().required('Required'),
  //Verification data
  originalArt: Yup.boolean().required('Required'),
  trainingConsent: Yup.boolean().required('Consent required'),
  legalContent: Yup.boolean().required('Required'),
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

const steps = ['Personal Information', 'Art Information', 'Upload & Verify'];

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  // const [thumbnails, setThumbnails] = useState<ArtistThumbnail[]>([]);
  const [thumbnails, setThumbnails] = useState<
    Array<File & { preview: string }>
  >([]);
  const [artFiles, setArtFiles] = useState<Array<File & { preview: string }>>(
    []
  );
  const [tags, setTags] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    console.log('thumbnails', thumbnails.length);
  }, [thumbnails]);

  //stepper functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // tag chip functions
  const handleAddTag = (newTag: string) => {
    if (!tags.includes(newTag) && newTag.trim() !== '') {
      setTags([...tags, newTag.trim()]);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  //form functions
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
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              sx={{
                padding: '2rem 1rem 4rem 1rem',
                width: '80%',
                alignSelf: 'center',
              }}
            >
              {steps.map((label, idx) => (
                <Step key={label} onClick={() => setActiveStep(idx)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <Box key={steps[0]}>
                {/* most of these fields the same. Just map it */}
                <Typography color="primary" variant="h5">
                  Personal Details
                </Typography>
                <Tooltip
                  title="Name will be displayed on the website"
                  placement="top-start"
                >
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
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <InfoOutlinedIcon />
                    //     </InputAdornment>
                    //   ),
                    // }}
                  />
                </Tooltip>
                <Tooltip
                  title="For Waterlily admin to contact you"
                  placement="top-start"
                >
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
                </Tooltip>
                <Tooltip
                  title="The address payments will be sent to. Must be an f4 ethereum address"
                  placement="top-start"
                >
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
                      formik.touched.walletAddress &&
                      formik.errors.walletAddress
                    }
                  />
                </Tooltip>
                <Tooltip
                  title="Optional. Will be displayed on website"
                  placement="top-start"
                >
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
                      formik.touched.nationality &&
                      Boolean(formik.errors.nationality)
                    }
                    helperText={
                      formik.touched.nationality && formik.errors.nationality
                    }
                  />
                </Tooltip>
                <Tooltip
                  title="Tell us about yourself and your art!"
                  placement="top-start"
                >
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
                      formik.touched.biography &&
                      Boolean(formik.errors.biography)
                    }
                    helperText={
                      formik.touched.biography && formik.errors.biography
                    }
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
                </Tooltip>
              </Box>
            )}
            {activeStep === 1 && (
              <Box
                key={steps[1]}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography color="primary" variant="h5">
                  Artwork Details
                </Typography>
                <Tooltip
                  title="New artists will be post-modern or digital"
                  placement="top-start"
                >
                  <TextField
                    id="category"
                    name="category"
                    label="Category"
                    variant="outlined"
                    fullWidth
                    select
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                    helperText={
                      formik.touched.category && formik.errors.category
                    }
                  >
                    {Object.values(ArtistCategory).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
                <Autocomplete
                  multiple
                  freeSolo
                  options={ArtStyleTags}
                  value={tags}
                  fullWidth
                  onChange={(event, newValue) => {
                    if (newValue.length < 5) {
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
                    <Tooltip
                      title="Enter up to 4 tags that describe your art style"
                      placement="top-start"
                      // arrow
                    >
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags"
                        placeholder={
                          tags.length >= 4
                            ? 'Only 4 tags allowable'
                            : 'Select or add tags'
                        }
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            if (tags.length < 5) {
                              handleAddTag(
                                (event.target as HTMLInputElement).value
                              );
                              (event.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        disabled={tags.length >= 4}
                      />
                    </Tooltip>
                  )}
                />
                <Tooltip
                  title="What is the predominate style of artwork you usually create? 1-2 words"
                  placement="top-start"
                  // arrow
                >
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
                </Tooltip>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Tooltip
                    title="Enter artwork creation dates eg. 1981 - 2020. Leave end date blank if still creating"
                    placement="top-start"
                    // arrow
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '81.4%',
                      }}
                    >
                      <Field
                        name="periodStart"
                        sx={{ '& .MuiTextField-root': { marginLeft: 0 } }}
                      >
                        {({ field, form }) => (
                          <DatePicker
                            {...field}
                            label="Period Start"
                            views={['year']}
                            openTo="year"
                            format="yyyy"
                            minDate={new Date(1200, 0, 1)}
                            maxDate={new Date()}
                            value={field.value || null}
                            onChange={(newValue) =>
                              form.setFieldValue(field.name, newValue)
                            }
                            error={
                              form.touched[field.name] &&
                              Boolean(form.errors[field.name])
                            }
                            helperText={
                              form.touched[field.name] &&
                              form.errors[field.name]
                            }
                          />
                        )}
                      </Field>
                      <Field name="periodEnd">
                        {({ field, form }) => (
                          <DatePicker
                            {...field}
                            label="Period End"
                            views={['year']}
                            openTo="year"
                            format="yyyy"
                            minDate={new Date(1200, 0, 1)}
                            maxDate={new Date()}
                            value={field.value || null}
                            onChange={(newValue) =>
                              form.setFieldValue(field.name, newValue)
                            }
                            error={
                              form.touched[field.name] &&
                              Boolean(form.errors[field.name])
                            }
                            helperText={
                              form.touched[field.name] &&
                              form.errors[field.name]
                            }
                          />
                        )}
                      </Field>
                    </Box>
                  </Tooltip>
                </LocalizationProvider>

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
                  helperText={
                    formik.touched.portfolio && formik.errors.portfolio
                  }
                />
                <Typography
                  color="primary"
                  variant="h5"
                  sx={{ padding: '1rem' }}
                >
                  Display Images
                </Typography>

                <Box sx={{ width: '80%' }}>
                  <ArtistUpload
                    files={thumbnails}
                    setFiles={setThumbnails}
                    maxFiles={5}
                    dropText="Drag and drop up to 5 examples of your artwork here, or"
                  />
                </Box>
              </Box>
            )}
            {activeStep === 2 && (
              <Box key={steps[2]}>
                <Typography color="primary" variant="h5">
                  Upload Art & Verify
                </Typography>
                {/* TODO: refactor to a component */}
                <Box sx={{ justifyContent: 'left', paddingTop: '1rem' }}>
                  <ArtistUpload
                    files={artFiles}
                    setFiles={setArtFiles}
                    maxFiles={1}
                    dropText="Drag and drop a zip file of at least 50 artworks, or"
                  />
                  <FormControlLabel
                    value="originalArt"
                    control={<Checkbox />}
                    label="Is your art your own original work?"
                    labelPlacement="start"
                    sx={{
                      width: '80%',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                    }}
                  />
                  <FormControlLabel
                    value="trainingConsent"
                    control={<Checkbox />}
                    label="Do you consent to having an ML Model trained on your artworks?"
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
              </Box>
            )}
            {activeStep === steps.length - 1 && (
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
            )}
            <Box
              sx={{
                width: '100%',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* <Typography sx={{ mt: 2, mb: 1 }}>
                  Step {activeStep + 1}
                </Typography> */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  pt: 2,
                  width: '80%',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Formik>
      <Typography>FAQ's somewhere too</Typography>
    </Box>
  );
};

export default ArtistSignup;
