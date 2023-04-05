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
import {
  DescriptionOutlined,
  MonochromePhotosOutlined,
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
import {
  Subtitle,
  Title,
  WalletButton,
  ArtistUpload,
  LinkTo,
  FormTextField,
} from '@/components';
import {
  FormData,
  initialFormValues,
  formValidationSchema,
  formStepSections,
  formStepSectionValues,
} from '@/definitions';
import {
  container,
  description,
  formikContainer,
  stepperContainer,
  iconStyle,
  biographyEndAdornment,
  biographyStartAdornment,
  biographyIcon,
  uploadContainer,
  activeStepContainer,
  dateContainer,
  checkContainer,
  stepButtonContainer,
  stepButtonWrapper,
} from '@/styles';

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  const { walletState = defaultWalletState } = useContext(WalletContext);
  const [activeStep, setActiveStep] = useState(0);

  //form functions
  const handleFormSubmit = async (values: FormData) => {
    console.log(values);
    // Validate inputs
    // await formValidationSchema
    //   .validate(values)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    // do something with the form data, e.g. submit it to a backend API
  };

  const key = 'name';

  return (
    <Box sx={container}>
      <HeaderLayout>
        <div onClick={() => handleNavigation('/')}>Home</div>
        {/* <Logo height={40} /> */}
        <WalletButton />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle text="Artist Onboarding" />
        <Box sx={description}>
          <Typography>
            Thankyou for your interest in joining Waterlily.ai!
          </Typography>
          <Typography>Let's get you started!</Typography>
          <LinkTo text="FAQ Link" arrow={false} />
        </Box>
      </TitleLayout>
      <Formik
        initialValues={initialFormValues}
        validationSchema={formValidationSchema}
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
            sx={formikContainer}
          >
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              sx={stepperContainer}
            >
              {formStepSections.map((label, idx) => (
                <Step key={label} onClick={() => setActiveStep(idx)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <Box key={formStepSections[0]}>
                {/* most of these fields the same. Just map it */}
                <Typography color="primary" variant="h5">
                  Personal Details
                </Typography>
                <FormTextField fieldKey="name" formik={formik} step={0} />
                <FormTextField fieldKey="email" formik={formik} step={0} />
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
                          <WalletOutlined sx={iconStyle} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
                <FormTextField
                  fieldKey="nationality"
                  formik={formik}
                  step={0}
                />
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
                        <Box sx={biographyStartAdornment}>
                          <DescriptionOutlined sx={biographyIcon} />
                        </Box>
                      ),
                      endAdornment: (
                        <Box sx={biographyEndAdornment}>
                          {formik.values.biography.length}/350
                        </Box>
                      ),
                    }}
                    inputProps={{
                      maxLength: 350,
                    }}
                  />
                </Tooltip>
                <Box sx={uploadContainer}>
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
              <Box key={formStepSections[1]} sx={activeStepContainer}>
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
                          <MonochromePhotosOutlined sx={iconStyle} />
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
                <FormTextField fieldKey="style" formik={formik} step={1} />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Tooltip
                    title="Enter artwork creation dates eg. 1981 - 2020. Leave end date blank if still creating"
                    placement="top-start"
                    // arrow
                  >
                    <Box sx={dateContainer}>
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
                <FormTextField fieldKey="portfolio" formik={formik} step={1} />
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
              <Box key={formStepSections[2]}>
                <Typography color="primary" variant="h5">
                  Upload Art & Verify
                </Typography>
                {/* TODO: refactor to a component */}
                <Box
                  sx={{
                    ...activeStepContainer,
                    paddingTop: '1rem',
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
                    sx={{ ...checkContainer, paddingTop: '1rem' }}
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
                    sx={checkContainer}
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
                    sx={checkContainer}
                  />
                </Box>
              </Box>
            )}
            {activeStep === formStepSections.length - 1 && (
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
            <Box sx={stepButtonWrapper}>
              <Box sx={stepButtonContainer}>
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
                    activeStep === formStepSections.length - 1
                    // || // Disable on last step
                    // !Object.keys(touched).length ||
                    // formStepSectionValues[`values${activeStep}`].some((fieldName) =>
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
