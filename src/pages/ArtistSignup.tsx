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
  Snackbar,
  Alert,
} from '@mui/material';
import { md5 } from 'pure-md5';
import {
  useNavigation,
  defaultWalletState,
  WalletContext,
  ImageContext,
  StatusContext,
  ContractContext,
  defaultStatusState,
} from '@/context';
import { HeaderLayout, TitleLayout } from '@/layouts';
import {
  Subtitle,
  Title,
  WalletButton,
  LinkTo,
  PersonalFormDetails,
  ArtFormDetails,
  ImagesFormDetails,
  AdminFormDetails,
  WalletFormDetails,
  StatusDisplay,
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

const TEST_ARTIST_ID = 'd2afcf0fa6416970c84c7ea9bde90d16';
const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET;

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { registerArtistWithContract, submitArtistFormToAPI } =
    useContext(ContractContext);
  const {
    snackbar,
    closeSnackbar,
    statusState = defaultStatusState.statusState,
  } = useContext(StatusContext);

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
    const { periodStart, periodEnd, images, avatar, thumbnails, ...rest } =
      values;
    return {
      data: {
        period: `${periodStartYear} - ${periodEndYear}`,
        ...rest,
      },
      images,
      avatar,
      thumbnails,
    };
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
      //TODO - change back to web3storage
      const artistId: string = md5(
        formattedValues.data.name +
          formattedValues.data.email +
          new Date().getTime()
      );
      if (!artistId) throw Error('Could not create artist ID');
      //await registerArtistWithContract(artistId)
      //await submitArtistFormToAPI(artistId, formattedValues.data, formattedValues.images, (formattedValues.avatar || []) as File[], formattedValues.thumbnails)
      await submitArtistFormToAPI(
        TEST_ARTIST_ID,
        formattedValues.data,
        formattedValues.images,
        (formattedValues.avatar || []) as File[],
        formattedValues.thumbnails
      );
    } catch (err) {
      // TODO: handle error and show in UI
      console.log(err);
    }
  };

  console.log('walletState', walletState);

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
      <StatusDisplay />
      {/* Check:
      1. that window.ethereum exists
      2. there's a web3 injected object
      3. There's an account[0]
      4. We are on the correct chain
      3. There is more than 0.1 FIL in the user's fil account
       */}
      {!walletState.isConnected || !walletState.accounts[0] ? (
        <WalletFormDetails />
      ) : walletState.accounts[0] ? (
        <Formik
          initialValues={initialFormValues}
          validationSchema={formValidationSchema}
          // validateOnChange
          validateOnBlur
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
              {activeStep === 0 && <PersonalFormDetails formik={formik} />}
              {activeStep === 1 && <ArtFormDetails formik={formik} />}
              {activeStep === 2 && (
                <>
                  <ImagesFormDetails formik={formik} />
                  {walletState.accounts[0].toUpperCase() ===
                    adminAddress?.toUpperCase() && (
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
            </Box>
          )}
        </Formik>
      ) : (
        <div>error</div>
      )}
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
