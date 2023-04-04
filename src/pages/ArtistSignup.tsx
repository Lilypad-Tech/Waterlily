import { useState, useContext } from 'react';
import {
  Formik,
  Field,
  // useFormikContext,
  // FormikHelpers,
  // FormikProps,
  // Form,
  // FieldProps,
  // ErrorMessage,
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
  LanguageOutlined,
  MonochromePhotosOutlined,
  PaletteOutlined,
  PermIdentityOutlined,
  PublicOutlined,
  WalletOutlined,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArtistCategory,
  ArtistType,
  ArtStyleTags,
  defaultWalletState,
  useNavigation,
  WalletContext,
} from '@/context';
import { HeaderLayout, TitleLayout } from '@/layouts';
import { Subtitle, Title, WalletButton, ArtistUpload } from '@/components';

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
  periodEnd: '', //new Date().getFullYear().toString(),
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
  periodEnd: Yup.string().required('Required'), //default = "2023 date"
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
    .min(50, 'At least 50 unique images required to train'),
  //Admin (if walletAddress === Lilypad "0x5617493b265E9d3CC65CE55eAB7798796D9108E4")
  artistType: Yup.string<ArtistType>(),
  artistId: Yup.string(),
});

const steps = ['Personal Information', 'Art Information', 'Upload & Verify'];
const stepValues: { [key: string]: string[] } = {
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
  const { walletState = defaultWalletState } = useContext(WalletContext);
  const [activeStep, setActiveStep] = useState(0);

  //form functions
  const handleFormSubmit = async (values: FormData) => {
    console.log(values);
    // Validate inputs
    // await validationSchema
    //   .validate(values)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
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
        // onSubmit={async (values, { setSubmitting, resetForm }) => {
        //   setSubmitting(true);
        //   // async request
        //   // --> if wanted to reset on submit: resetForm();
        //   console.log(values);
        //   setSubmitting(false);
        // }}
        onSubmit={(values) => console.log(values)}
      >
        {(
          formik,
          {
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isValid,
          } = formik
        ) => (
          <Box
            component="form"
            autoComplete="off"
            noValidate
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSubmit();
            }}
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
                {/* TODO: turn into dependent - can choose charity instead + better validation */}
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
                    value={(values.walletAddress = walletState.accounts[0])}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    onBlur={handleBlur}
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
                    value={values.biography}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.biography && Boolean(errors.biography)}
                    helperText={touched.biography && errors.biography}
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
                  {/* TODO: add error handling & fix this */}
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
                    required
                    select
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonochromePhotosOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
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
                            values.tags.filter((tag) => tag !== option)
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
                          values.tags.length >= 4
                            ? 'Only 4 tags allowable'
                            : 'Select or type in artwork style tags'
                        }
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            if (values.tags.length < 5) {
                              let e = event.target as HTMLInputElement;
                              let newTag = e.value;
                              if (
                                !values.tags.includes(newTag) &&
                                newTag.trim() !== ''
                              ) {
                                setFieldValue('tags', [
                                  ...values.tags,
                                  newTag.trim(),
                                ]);
                              }
                            }
                          }
                        }}
                        disabled={values.tags.length >= 4}
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
                    required
                    fullWidth
                    value={values.style}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.style && Boolean(errors.style)}
                    helperText={touched.style && errors.style}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaletteOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
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
                      <Field name="periodStart">
                        {({ field, form }) => (
                          <DatePicker
                            {...field}
                            label="Period Start *"
                            views={['year']}
                            openTo="year"
                            format="yyyy"
                            disableFuture
                            minDate={new Date(1200, 0, 1)}
                            maxDate={new Date()}
                            value={field.value || new Date(1880, 0, 1)}
                            onChange={(newValue, errContext) => {
                              console.log('on change', newValue, errContext);
                              console.log(
                                'on change',
                                formik.touched,
                                formik.errors,
                                formik.values,
                                formik
                              );
                              //not working shrugs
                              errContext.validationError &&
                                formik.setFieldError(
                                  field.name,
                                  errContext.validationError
                                );
                              formik.setFieldValue(field.name, newValue);
                              formik.setFieldTouched(field.name, true);
                            }}
                            slots={{
                              TextField,
                            }}
                            slotProps={{
                              textField: {
                                helperText:
                                  formik.touched.periodStart &&
                                  formik.errors.periodStart, //'Select a Date',
                              },
                            }}
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
                            disableFuture
                            minDate={new Date(1200, 0, 1)}
                            maxDate={new Date()}
                            value={field.value || new Date()}
                            onChange={(newValue, errContext) => {
                              console.log('on change', newValue, errContext);
                              console.log(
                                'on change',
                                formik.touched,
                                formik.errors,
                                formik.values,
                                form
                              );
                              //not working shrugs
                              form.setFieldError(
                                field.name,
                                errContext?.validationError
                              );
                              form.setFieldValue(field.name, newValue);
                              form.setFieldTouched(field.name, true);
                            }}
                            slots={{
                              TextField,
                            }}
                            slotProps={{
                              textField: {
                                helperText: `${
                                  form.errors.periodEnd &&
                                  form.touched.periodEnd
                                    ? 'Help me'
                                    : ''
                                }`,
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Box>
                  </Tooltip>
                </LocalizationProvider>
                <Tooltip
                  title="Portfolio or Art Sales link"
                  placement="top-start"
                  // arrow
                >
                  <TextField
                    id="portfolio"
                    name="portfolio"
                    label="Portfolio"
                    placeholder="https://www.waterlily.ai"
                    variant="outlined"
                    fullWidth
                    value={values.portfolio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.portfolio && Boolean(errors.portfolio)}
                    helperText={touched.portfolio && errors.portfolio}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageOutlined
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
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
                    id="originalArt"
                    name="originalArt"
                    value="originalArt"
                    control={
                      <Checkbox
                        checked={values.originalArt || false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.originalArt && Boolean(errors.originalArt)
                        }
                      />
                    }
                    label="Is your art your own original work?"
                    labelPlacement="start"
                    sx={{
                      width: '80%',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                    }}
                  />
                  <FormControlLabel
                    id="trainingConsent"
                    name="trainingConsent"
                    value="trainingConsent"
                    control={
                      <Checkbox
                        checked={values.trainingConsent || false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.trainingConsent &&
                          Boolean(errors.trainingConsent)
                        }
                      />
                    }
                    label="Do you consent to having an ML Model trained on your artworks?"
                    labelPlacement="start"
                    sx={{ width: '80%', justifyContent: 'space-between' }}
                  />
                  <FormControlLabel
                    id="legalContent"
                    name="legalContent"
                    value="legalContent"
                    control={
                      <Checkbox
                        checked={values.legalContent || false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.legalContent && Boolean(errors.legalContent)
                        }
                      />
                    }
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
                  disabled={Boolean(!isValid)}
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
                  onClick={() =>
                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                  }
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    console.log(formik);
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                  }}
                  //only disable if partial errors on this part of the form
                  disabled={
                    activeStep === steps.length - 1
                    // || // Disable on last step
                    // !Object.keys(touched).length ||
                    // stepValues[`values${activeStep}`].some((fieldName) =>
                    //   Boolean(errors[fieldName])
                    // )
                  }
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
