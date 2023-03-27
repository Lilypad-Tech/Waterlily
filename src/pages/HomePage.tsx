import { forwardRef, useState, useContext, useEffect } from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { KeyboardDoubleArrowUpRounded } from '@mui/icons-material';
import {
  HeaderLayout,
  TitleLayout,
  SectionLayout,
  UserInputLayout,
  ArtistLayout,
  ArtistListLayout,
  ImageListLayout,
} from '@/layouts';
import {
  Title,
  Subtitle,
  Description,
  UserInput,
  ArtistCard,
  WalletButton,
  ImageHeader,
  CalloutMessage,
  ImageQuickCard,
  TwitterLink,
  StatusMessage,
  GeneratedImages,
  ErrorMessage,
  ArtistCardGrid,
  // ParrotLoader,
} from '@/components';

import {
  ContractContext,
  WalletContext,
  defaultWalletState,
  StatusContext,
  defaultStatusState,
  ImageContext,
  ArtistContext,
  ArtistType,
} from '@/context';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const HomePage = () => {
  const [isCallout] = useState(true);
  const { artistState: artists } = useContext(ArtistContext);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const {
    snackbar,
    closeSnackbar,
    statusState = defaultStatusState.statusState,
  } = useContext(StatusContext);
  const { quickImages, imagePrompt, imageArtist, setImageArtist, twitterLink } =
    useContext(ImageContext);
  const { customerImages } = useContext(ContractContext);

  const goToTop = () => {
    return document.getElementById('justAboveTextField')?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };

  useEffect(() => {
    console.log('artistState', artists);
  }, [artists]);

  return (
    <>
      <HeaderLayout>
        <div></div>
        {/* <Logo height={40} /> */}
        <WalletButton />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle />
        <Description />
      </TitleLayout>
      {quickImages.length > 0 && (
        <SectionLayout>
          <ImageHeader />
          {Boolean(twitterLink) && <TwitterLink />}
          <ImageListLayout>
            {quickImages
              .filter((i) => (i.indexOf('combined') > 0 ? false : true))
              .map((quickImageURL, idx) => {
                return (
                  <ImageQuickCard
                    key={idx}
                    idx={idx}
                    image={{
                      link: quickImageURL,
                      alt: 'Not found',
                    }}
                    sx={{
                      maxWidth: 250,
                      border: '1px solid white',
                    }}
                  />
                );
              })}
          </ImageListLayout>
        </SectionLayout>
      )}
      {statusState.isError && (
        <SectionLayout>
          <ErrorMessage />
        </SectionLayout>
      )}
      <div id="justAboveTextField"></div>
      <SectionLayout>
        {!walletState?.isConnected ? (
          <WalletButton />
        ) : !Boolean(statusState.isLoading) ? (
          <UserInputLayout>
            <UserInput
              initialPrompt={imagePrompt}
              initialArtist={imageArtist}
            />
          </UserInputLayout>
        ) : (
          <StatusMessage />
        )}
      </SectionLayout>
      <ArtistLayout>
        <Title
          text="Featured Artists"
          sx={{ fontSize: '3rem', paddingTop: '2rem' }}
        />
        {/* <ArtistListLayout> */}
        <ArtistCardGrid navigate={goToTop} />
        {/* </ArtistListLayout> */}
        {isCallout && <CalloutMessage />}
      </ArtistLayout>
      <SectionLayout>
        <>
          <Title
            text="Your Generated Images"
            sx={{ fontSize: '3rem', paddingTop: '2rem' }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {customerImages.length < 1 ? (
              <Typography onClick={goToTop}>Generate an Image!</Typography>
            ) : (
              <GeneratedImages />
            )}
            <Box sx={{ padding: '1rem 0' }}>
              <Button
                onClick={goToTop}
                endIcon={<KeyboardDoubleArrowUpRounded />}
                aria-label="Back to Top"
              >
                Back to Top
              </Button>
            </Box>
          </Box>
        </>
      </SectionLayout>
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
    </>
  );
};

export default HomePage;
