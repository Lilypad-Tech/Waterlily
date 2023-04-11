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
import {
  useNavigation,
  defaultWalletState,
  WalletContext,
  ImageContext,
  StatusContext,
  ContractContext,
  defaultStatusState,
  NetworkContext,
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

// const TEST_ARTIST_ID =
//   'bafybeigzcrdmnjb2rtnradex62vkfenm764iud64lzpzjqhbzfg7gho6za';
const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET;

const ArtistSignup: React.FC<{}> = () => {
  const { handleNavigation } = useNavigation();
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { registerArtistWithContract, submitArtistFormToAPI } =
    useContext(ContractContext);
  const { network } = useContext(NetworkContext);
  const {
    snackbar,
    closeSnackbar,
    statusState = defaultStatusState.statusState,
    setStatusState,
  } = useContext(StatusContext);
  const { createArtistId } = useContext(ImageContext);

  const [activeStep, setActiveStep] = useState(0);

  const renderWalletRequirementsMessage = () => {
    return (
      <Box
        sx={{
          border: '1px solid #b583ff',
          borderRadius: '10px',
          padding: '0.5rem',
          margin: '0 4rem',
        }}
      >
        <Typography>
          A wallet with a balance of min. 0.1FIL is required to sign up to
          Waterlily.ai
        </Typography>
        <Typography>
          We do this to try to deter imposters as well as to cover the costs of
          adding new artists to the Waterlily contract.
        </Typography>
        <Typography>
          Please contact us if you have trouble with this step.
        </Typography>
      </Box>
    );
  };

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
    setStatusState({
      ...defaultStatusState.statusState,
      isLoading: `Thankyou! Validating your form ${values.name}!`,
    });
    try {
      //1. Validate inputs
      const isValid = await validateFormInput(values);
      if (!isValid) throw Error('Invalid Form data');
      //2. Format the inputs as needed
      const formattedValues = formatFormInput(values);
      //3. Create the artistId (also creates a cid of the metadata)
      //TODO - change back to web3storage
      const { images, ...cidData } = formattedValues;
      const artistId = await createArtistId(cidData);
      console.log('formattedValues', formattedValues);
      if (!artistId) throw Error('Could not create artist ID');
      const receipt = await registerArtistWithContract(artistId);
      console.log('receipt in signup', receipt);
      if (Boolean(receipt))
        throw Error(
          'Could not call the contract - check your wallet transaction'
        );
      await submitArtistFormToAPI(
        artistId,
        //TEST_ARTIST_ID,
        formattedValues.data,
        formattedValues.images,
        (formattedValues.avatar || []) as File[],
        formattedValues.thumbnails
      );
    } catch (err: any) {
      // TODO: handle error and show in UI
      console.log(err);
      setStatusState({
        ...defaultStatusState.statusState,
        isError: true,
        isMessage: true,
        message: {
          title: 'Something went wrong',
          description: (
            <Box>{err.message || 'Error Submitting Artist Details'}</Box>
          ),
        },
      });
    }
  };

  console.log('walletState', walletState);

  return (
    <Box sx={container}>
      <HeaderLayout>
        <Box onClick={() => handleNavigation('')}>{'<- Back'}</Box>
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
        <div>
          <WalletFormDetails />
          {renderWalletRequirementsMessage()}
        </div>
      ) : walletState.accounts[0] && walletState.balance < 0.1 ? (
        renderWalletRequirementsMessage()
      ) : walletState.chainId !== network.chainId ? (
        <div>wrong chain</div>
      ) : (
        <Formik
          initialValues={initialFormValues}
          validationSchema={formValidationSchema}
          // validateOnChange
          validateOnBlur
          onSubmit={handleFormSubmit} //FIX THIS so it doesn't auto reset. (for failures)
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
                    disabled={Boolean(!isValid) || statusState.isLoading}
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
