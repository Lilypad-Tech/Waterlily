import { useState, useContext, useEffect } from 'react';
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
  FormControl,
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
  Snackbar,
  Alert,
} from '@mui/material';
import {md5} from 'pure-md5';
import { DescriptionOutlined, WalletOutlined } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArtistCategory,
  ArtistType,
  ArtStyleTags,
  defaultWalletState,
  StatusContext,
  useNavigation,
  WalletContext,
  ContractContext,
  ImageContext,
  defaultStatusState,
} from '@/context';
import { SectionLayout, HeaderLayout, TitleLayout } from '@/layouts';
import {
  Subtitle,
  Title,
  WalletButton,
  ArtistUpload,
  LinkTo,
  FormTextField,
  ErrorMessage,
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

const TEST_ARTIST_ID = 'd2afcf0fa6416970c84c7ea9bde90d16'

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  const { walletState = defaultWalletState } = useContext(WalletContext);
  const { registerArtistWithContract, submitArtistFormToAPI } = useContext(ContractContext);
  const {
    snackbar,
    closeSnackbar,
    statusState = defaultStatusState.statusState,
  } = useContext(StatusContext);
  
  // const {addArtist} = useContext(ContractContext);
  // const {} = useContext(StatusContext);
  const [activeStep, setActiveStep] = useState(0);

  const validateFormInput = async (values: FormData) => {
    const isValid = await formValidationSchema
      .validate(values)
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return isValid; //boolean or void returned.
  };

  const formatFormInput = (values: FormData) => {
    const periodStartYear = values.periodStart.getFullYear().toString();
    // const currentYear = new Date().getFullYear();
    const periodEndYear =
      values.periodEnd.getFullYear() === new Date().getFullYear()
        ? 'current'
        : values.periodEnd.getFullYear().toString();
    const { periodStart, periodEnd, images, avatar, thumbnails, ...rest } = values;
    return {
      data: {
        period: `${periodStartYear} - ${periodEndYear}`,
        ...rest,
      },
      images,
      avatar,
      thumbnails,
    }
  };

  //form functions
  const handleFormSubmit = async (values: FormData) => {
    console.log(values);
    try {
      //1. Validate inputs
      const isValid = await validateFormInput(values);
      if (!isValid) throw Error('Invalid Form data');
      //2. Format the inputs as needed
      const formattedValues = formatFormInput(values);
      //3. Create the artistId (also creates a cid of the metadata)
      const artistId: string = md5(formattedValues.data.name + formattedValues.data.email + new Date().getTime());
      if (!artistId) throw Error('Could not create artist ID');
      //await registerArtistWithContract(artistId)
      await submitArtistFormToAPI(TEST_ARTIST_ID, formattedValues.data, formattedValues.images, (formattedValues.avatar || []) as File[], formattedValues.thumbnails)
    } catch (err) {
      console.log(err);
    }
  };

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
        onSubmit={handleFormSubmit}
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
            {statusState.isError && (
              <SectionLayout>
                <ErrorMessage />
              </SectionLayout>
            )}
            {
              statusState.message?.title ? (
                <Box
                  sx={{
                    padding: '0 1rem',
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      border: '1px solid #b583ff',
                      borderRadius: '10px',
                      padding: '1rem',
                      width: '70%',
                    }}
                  >
                    <div>{statusState.message?.title}</div>
                    <div>{statusState.message?.description}</div>
                  </Box>
                </Box>
              ) : (
                <>
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
                          <ArtistUpload maxFiles={1} formik={formik} name="avatar" />
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {activeStep === 1 && (
                    <Box key={formStepSections[1]} sx={activeStepContainer}>
                      <Typography color="primary" variant="h5">
                        Artwork Details
                      </Typography>
                      <FormTextField fieldKey="category" formik={formik} step={1}>
                        {Object.values(ArtistCategory).map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </FormTextField>
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
                          <Box
                            sx={{
                              width: '80%',
                              display: 'flex',
                            }}
                          >
                            <Box sx={dateContainer}>
                              {/* TODO: will need to validate this has been touched */}
                              <FormControl
                                error={true}
                                required
                                fullWidth
                                sx={{
                                  '& .MuiFormControl-root': {
                                    width: '98%',
                                    marginLeft: 0,
                                  },
                                  padding: '3px 0',
                                }}
                              >
                                <DatePicker
                                  label="Period Start *"
                                  views={['year']}
                                  openTo="year"
                                  format="yyyy"
                                  disableFuture
                                  minDate={new Date(1200, 0, 1)}
                                  maxDate={new Date()}
                                  value={values.periodStart} // || new Date(1900, 0, 1)}
                                  onError={(err) => {
                                    console.log('error', err);
                                    //should update
                                    formik.validateField('periodStart');
                                  }}
                                  onChange={(newValue, errContext) => {
                                    formik.handleChange({
                                      target: {
                                        name: 'periodStart',
                                        value: newValue,
                                      },
                                    });
                                    formik.handleBlur({
                                      target: {
                                        name: 'periodStart',
                                      },
                                    });
                                  }}
                                  slotProps={{
                                    textField: {
                                      helperText:
                                        formik.touched.periodStart &&
                                        Boolean(formik.errors.periodStart) &&
                                        String(formik.errors.periodStart),
                                      // : 'Select a valid Date',
                                    },
                                  }}
                                />
                              </FormControl>
                              {/*probably better? OR useField gah. <FormControlLabel
                          id="trainingConsent"
                          name="trainingConsent"
                          value="trainingConsent" */}
                              <FormControl
                                error={true}
                                fullWidth
                                required
                                sx={{
                                  '& .MuiFormControl-root': {
                                    width: '98%',
                                    marginRight: 0,
                                  },
                                  padding: '3px 0',
                                }}
                              >
                                <DatePicker
                                  label="Period End"
                                  views={['year']}
                                  openTo="year"
                                  format="yyyy"
                                  disableFuture
                                  minDate={new Date(1200, 0, 1)}
                                  maxDate={new Date()}
                                  value={values.periodEnd} // || new Date(1900, 0, 1)}
                                  onError={(err) => {
                                    console.log('error', err);
                                    formik.validateField('periodStart');
                                    //should update
                                  }}
                                  onChange={(newValue, errContext) => {
                                    formik.handleChange({
                                      target: {
                                        name: 'periodEnd',
                                        value: newValue,
                                      },
                                    });
                                    formik.handleBlur({
                                      target: {
                                        name: 'periodEnd',
                                      },
                                    });
                                  }}
                                  slotProps={{
                                    textField: {
                                      helperText:
                                        formik.touched.periodEnd &&
                                        Boolean(formik.errors.periodEnd) &&
                                        String(formik.errors.periodEnd),
                                      // : 'Select a valid Date',
                                    },
                                  }}
                                />
                              </FormControl>
                            </Box>
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
                            maxFiles={5}
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
                              maxFiles={200}
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
                          activeStep === formStepSections.length - 1 || // Disable on last step
                          !Object.keys(touched).length ||
                          formStepSectionValues[`values${activeStep}`].some(
                            (fieldName) => Boolean(errors[fieldName])
                          )
                        }
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </>
              )
            }
          </Box>
        )}
      </Formik>
      <LinkTo text="Got Questions? Check out the FAQ" />
      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={10000}
          onClose={closeSnackbar}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.type as any}
            sx={{ width: '100%' }}
          >
            <Box
              sx={{
                color: '#fff',
              }}
            >
              {snackbar.message}
            </Box>
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default ArtistSignup;
