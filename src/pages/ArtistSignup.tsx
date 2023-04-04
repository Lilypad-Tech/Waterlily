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
  Link,
} from '@mui/material';
import {
  ArrowRightAltOutlined,
  DescriptionOutlined,
  EmailOutlined,
  PermIdentityOutlined,
  PublicOutlined,
  WalletOutlined,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArtistData,
  ArtistCategory,
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
  ArtistUpload,
} from '@/components';

interface FormData {
  //Personal Data
  name: string;
  email: string;
  walletAddress: string;
  nationality?: string;
  periodStart: string;
  periodEnd?: string;
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

const initialValues: FormData = {
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
  category: ArtistCategory.PostModern, //empty really
  style: '',
  tags: [],
  periodStart: '',
  periodEnd: '',
  portfolio: '', //link to portfolio
  thumbnails: [], //up to 5 images, best 668x504 =
  //verification data
  originalArt: false,
  trainingConsent: false,
  legalContent: false,
  images: [], //send elsewhere
  //admin only
  artistType: ArtistType.Private,
  artistId: '',
};

const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  //Personal Data
  name: Yup.string()
    .required('Required')
    .min(3, 'Name must be at least 3 charachters long'),
  email: Yup.string().email('Must be a valid email').required('Required'),
  walletAddress: Yup.string().required('Required'),
  nationality: Yup.string().optional(), //opt
  biography: Yup.string()
    .required('Required')
    .max(350, 'No more than 350 characters will be displayed'),
  avatar: Yup.array<File>().optional(), //opt
  //ArtWork Data
  category: Yup.string<ArtistCategory>().required('Required'),
  tags: Yup.array().optional(), //opt
  style: Yup.string().required('Required'),
  periodStart: Yup.string().required('Required'), //Yup.date ?
  periodEnd: Yup.string().optional(), //if blank = "current"
  portfolio: Yup.string().url().required('Required'),
  thumbnails: Yup.array<File>()
    .required('Required')
    .min(1, 'At least one thumbnail image required'),
  //Verification data
  originalArt: Yup.boolean().required('Required'),
  trainingConsent: Yup.boolean().required('Consent required'),
  legalContent: Yup.boolean().required('Required'),
  images: Yup.array<File>()
    .required('Required')
    .min(50, 'At least 50 unique images required to train'),
  //Admin (if walletAddress === Lilypad "0x5617493b265E9d3CC65CE55eAB7798796D9108E4")
  artistType: Yup.string<ArtistType>(),
  artistId: Yup.string(),
});

const onSubmit = (values: FormData) => {
  console.log(values);
  // You can send form data to a backend API or handle it in any way you want
};

const steps = ['Personal Information', 'Art Information', 'Upload & Verify'];
const stepValues = {
  0: ['name', 'email', 'walletAddress', 'nationality', 'biography', 'avatar'],
  1: [
    'category',
    'tags',
    'style',
    'periodStart',
    'periodEnd',
    'portfolio',
    'thumbnails',
  ],
  2: ['images', 'originalArt', 'trainingConsent', ' legalContent'],
};

const LinkTo: React.FC<{
  text: string;
  href?: string;
  arrow?: boolean;
}> = ({ text, href, arrow = true }) => {
  return (
    <Link
      href={
        href
          ? href
          : 'https://luck-muscle-f89.notion.site/Waterlily-ai-FAQs-e920ff00040d411eab93538525abaa3c'
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '0.5rem',
        }}
      >
        <Typography>{text}</Typography>
        {arrow && <ArrowRightAltOutlined />}
      </Box>
    </Link>
  );
};

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  // const [tags, setTags] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  //stepper functions
  const handleNext = (values: FormData) => {
    //validate inputs here
    //check no errors is all.
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //form functions
  const handleFormSubmit = async (values: FormData) => {
    console.log(values);
    // Validate inputs
    await validationSchema
      .validate(values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <Typography>
            Thankyou for your interest in joining Waterlily.ai!
          </Typography>
          <Typography>Let's get you started!</Typography>
          <LinkTo text="FAQ Link" arrow={false} />
        </Box>
      </TitleLayout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // validateOnChange
        validateOnBlur
        onSubmit={(values: FormData, actions: FormikHelpers<FormData>) => {
          console.log('Submitting', values);
          // await sleep(1500);
          // alert(JSON.stringify(values, null, 2));
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   actions.setSubmitting(false);
          // }, 500);
          // handleFormSubmit(values).then(() => {
          //   actions.setSubmitting(false);
          //   actions.resetForm({
          //     values: values, //initialValues,
          //     // you can also set the other form states here
          //   });
          // });
        }}
        // validate={(values) => {
        //   const errors = {};
        //   if (!values.name) {
        //     errors.name = 'Required';
        //   }
        //   return errors;
        // }}
      >
        {(
          formik,
          { values, errors, touched, handleBlur, handleChange } = formik
        ) => (
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
                    required
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PermIdentityOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
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
                    required
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
                {/* TODO: turn into dependent - can choose charity instead */}
                <Tooltip
                  title="The address payments will be sent to. Must be an f4 ethereum address"
                  placement="top-start"
                >
                  <TextField
                    id="walletAddress"
                    name="walletAddress"
                    label="Wallet Address"
                    variant="outlined"
                    required
                    fullWidth
                    value={values.walletAddress}
                    onChange={handleChange}
                    error={
                      touched.walletAddress && Boolean(errors.walletAddress)
                    }
                    helperText={touched.walletAddress && errors.walletAddress}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WalletOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
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
                    placeholder="Your Nationality"
                    variant="outlined"
                    fullWidth
                    value={values.nationality}
                    onChange={handleChange}
                    error={touched.nationality && Boolean(errors.nationality)}
                    helperText={touched.nationality && errors.nationality}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
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
                    required
                    fullWidth
                    multiline
                    minRows={3}
                    value={formik.values.biography}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.biography)}
                    helperText={formik.errors.biography}
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: '2rem',
                          }}
                        >
                          <DescriptionOutlined
                            sx={{
                              position: 'absolute',
                              top: '1rem',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          />
                        </Box>
                      ),
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: '80%' }}>
                    <ArtistUpload
                      files={formik.values.avatar}
                      setFiles={(files) =>
                        formik.setFieldValue(
                          'avatar',
                          Array.isArray(files) ? files : []
                        )
                      }
                      maxFiles={1}
                      dropText="Upload an Artist Profile picture"
                      formik={formik}
                      name="avatar"
                    />
                  </Box>
                </Box>
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
                  options={Array.from(new Set(ArtStyleTags)).sort()} //make sure its unique and alphabetise
                  value={formik.values.tags}
                  fullWidth
                  onChange={(event, newValue) => {
                    if (newValue.length < 5) {
                      formik.setFieldValue('tags', newValue);
                    }
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        color="primary"
                        {...getTagProps({ index })}
                        label={option}
                        onDelete={() =>
                          formik.setFieldValue(
                            'tags',
                            formik.values.tags.filter((tag) => tag !== option)
                          )
                        }
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
                          formik.values.tags.length >= 4
                            ? 'Only 4 tags allowable'
                            : 'Select or add tags'
                        }
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            if (formik.values.tags.length < 5) {
                              let e = event.target as HTMLInputElement;
                              let newTag = e.value;
                              if (
                                !formik.values.tags.includes(newTag) &&
                                newTag.trim() !== ''
                              ) {
                                formik.setFieldValue('tags', [
                                  ...formik.values.tags,
                                  newTag.trim(),
                                ]);
                              }
                            }
                          }
                        }}
                        disabled={formik.values.tags.length >= 4}
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
                <Tooltip
                  title="Artwork is displayed in a 3:2 aspect ratio frame as shown in the preview below. For example a 900px x 600px image has a 3:2 ratio. These images are watermarked before being saved for display on the site and your metadata saved on each."
                  placement="top-start"
                >
                  <Box sx={{ width: '80%' }}>
                    <ArtistUpload
                      files={formik.values.thumbnails}
                      setFiles={(files) =>
                        formik.setFieldValue(
                          'thumbnails',
                          Array.isArray(files) ? files : []
                        )
                      }
                      maxFiles={5}
                      dropText="Drag and drop up to 5 examples of your artwork here, or"
                      formik={formik}
                      name="thumbnails"
                    />
                  </Box>
                </Tooltip>
              </Box>
            )}
            {activeStep === 2 && (
              <Box key={steps[2]}>
                <Typography color="primary" variant="h5">
                  Upload Art & Verify
                </Typography>
                {/* TODO: refactor to a component */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    width: '100%',
                  }}
                >
                  <Tooltip
                    title="These images are ONLY used to train a model. After the model is trained they are removed & permanently deleted from the server. This is completely automated."
                    placement="top-start"
                  >
                    <Box sx={{ width: '80%' }}>
                      <ArtistUpload
                        files={formik.values.images}
                        setFiles={(files) =>
                          formik.setFieldValue(
                            'images',
                            Array.isArray(files) ? files : []
                          )
                        }
                        maxFiles={200}
                        dropText="Drag and drop at least 50 original artworks, or"
                        formik={formik}
                        name="images"
                      />
                    </Box>
                  </Tooltip>
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
                  // disabled={formik.actions.isSubmitting}
                  disabled={!formik.isValid}
                  onClick={() => onSubmit(formik.values)}
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
                  onClick={() => handleNext(formik.values)}
                  disabled={activeStep === steps.length - 1}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Formik>
      <LinkTo text="Got Questions? Check out the FAQ" />
    </Box>
  );
};

export default ArtistSignup;
