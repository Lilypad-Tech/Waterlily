import { useState, useContext } from 'react';
import {
  Formik,
  // useFormikContext,
  // FormikHelpers,
  // FormikProps,
  // Form,
  // FieldProps,
  // ErrorMessage,
} from 'formik';
import {
  Box,
  Button,
  Typography,
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
  useNavigation,
  defaultWalletState,
  WalletContext,
  ImageContext,
  defaultStatusState,
  StatusContext,
  ContractContext,
} from '@/context';
import { SectionLayout, HeaderLayout, TitleLayout } from '@/layouts';
import {
  Subtitle,
  Title,
  WalletButton,
  LinkTo,
  FormTextField,
  ErrorMessage,
  PersonalFormDetails,
  ArtFormDetails,
  ImagesFormDetails,
  AdminFormDetails,
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
  stepButtonContainer,
  stepButtonWrapper,
} from '@/styles';

const TEST_ARTIST_ID = 'd2afcf0fa6416970c84c7ea9bde90d16'

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { registerArtistWithContract, submitArtistFormToAPI } = useContext(ContractContext);
  const {
    snackbar,
    closeSnackbar,
    statusState = defaultStatusState.statusState,
  } = useContext(StatusContext);
  
  // const {addArtist} = useContext(ContractContext);
  // const {} = useContext(StatusContext);
  const [activeStep, setActiveStep] = useState(2);

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
      //await submitArtistFormToAPI(artistId, formattedValues.data, formattedValues.images, (formattedValues.avatar || []) as File[], formattedValues.thumbnails)
      await submitArtistFormToAPI(TEST_ARTIST_ID, formattedValues.data, formattedValues.images, (formattedValues.avatar || []) as File[], formattedValues.thumbnails)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={container}>
      <HeaderLayout>
        <Box onClick={() => handleNavigation('/')}>{'<- Back'}</Box>
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
        {(formik, { errors, touched, handleSubmit, isValid } = formik) => (
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
                  {activeStep === 0 && <PersonalFormDetails formik={formik} />}
                  {activeStep === 1 && <ArtFormDetails formik={formik} />}
                  {activeStep === 2 && (
                    <>
                      <ImagesFormDetails formik={formik} />
                      {walletState.accounts[0] ===
                        '0x5617493b265e9d3cc65ce55eab7798796d9108e4' && (
                        <AdminFormDetails formik={formik} />
                      )}
                    </>
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
