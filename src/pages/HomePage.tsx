import { forwardRef, useState, useContext, useEffect } from 'react';
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
  Logo,
  Title,
  Subtitle,
  Description,
  UserInput,
  ArtistCard,
  WalletButton,
  ImageHeader,
  CalloutMessage,
} from '@/components';
import { artists } from '@/definitions/artists';
import {
  WalletContext,
  defaultWalletState,
  StatusContext,
  defaultStatusState,
  ImageContext,
} from '@/context';
import { ImageQuickCard } from '@/components';
import { CircularProgress, Box, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Link from '@mui/material/Link';
import TwitterIcon from '@mui/icons-material/Twitter';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ipfsRoot = 'https://ipfs.io/ipfs/';

const HomePage = () => {
  const [isCallout, setCallout] = useState(true);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const {
    snackbar,
    closeSnackbar,
    statusState = defaultStatusState.statusState,
    resetStatusState,
  } = useContext(StatusContext);
  const {
    imageState,
    quickImages,
    imagePrompt,
    imageArtist,
    setImageArtist,
    twitterLink,
  } = useContext(ImageContext);

  return (
    <>
      <HeaderLayout>
        <Logo height={40} />
        <WalletButton />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle />
        <Description />
      </TitleLayout>
      {/* {imageState.generatedImages && (
        <SectionLayout>
          <ImageHeader />
          <ImageListLayout>
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_0.png`,
                alt: 'Not seen',
              }}
            />
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_1.png`,
                alt: 'Not seen',
              }}
            />
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_2.png`,
                alt: 'Not seen',
              }}
            />
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_3.png`,
                alt: 'Not seen',
              }}
            />
          </ImageListLayout>
        </SectionLayout>
      )} */}
      {quickImages.length > 0 && (
        <SectionLayout>
          <ImageHeader />
          <ImageListLayout>
            {quickImages.map((quickImageURL, idx) => {
              return (
                <ImageQuickCard
                  key={idx}
                  idx={idx}
                  image={{
                    link: quickImageURL,
                    alt: 'Not found',
                  }}
                />
              );
            })}
          </ImageListLayout>
          {Boolean(twitterLink) && (
            <Link
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TwitterIcon />
                <Typography color="white" sx={{ paddingLeft: '10px' }}>
                  Share on Twitter
                </Typography>
              </Box>
            </Link>
          )}
        </SectionLayout>
      )}
      {statusState.isError && (
        <SectionLayout>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ paddingTop: '1rem' }}>
              <Typography variant="h5">{statusState.isError}</Typography>
            </div>
          </Box>
        </SectionLayout>
      )}
      {/* this shows up with really in your face styling. just using snackbar instead...*/}
      {/* {statusState.isError && (
        <SectionLayout>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Alert
              onClose={resetStatusState}
              severity="error"
              sx={{ width: '100%' }}
            >
              <div style={{ paddingTop: '1rem' }}>
                <Typography variant="h5">
                  {statusState.message?.title}
                </Typography>
              </div>
            </Alert>
          </Box>
        </SectionLayout>
      )} */}
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
          <>
            {/* TO DO BREAK OUT INTO PROPER COMPONENT */}
            <CircularProgress size={100} />
            <div>{statusState.isLoading}</div>
            {statusState.isMessage && (
              <div>
                <div>{statusState.message?.title}</div>
                <div>{statusState.message?.description}</div>
              </div>
            )}
          </>
        )}
      </SectionLayout>
      <ArtistLayout>
        <Title
          text="Featured Artists"
          sx={{ fontSize: '3rem', paddingTop: '2rem' }}
        />
        {isCallout && (
          <CalloutMessage
            text="Become a Featured Artist! "
            onClick={() => {
              window.open('https://bit.ly/AI-Art-Attribution-Form', '_blank');
            }}
            setCallout={setCallout}
          />
        )}
        <ArtistListLayout>
          {artists.map((artist, e) => {
            const { artistId, name, style, description, portfolio, image } =
              artist;
            return (
              <ArtistCard
                key={e}
                name={name}
                style={style}
                description={description}
                portfolio={portfolio}
                image={image}
                disabled={statusState.isLoading ? true : false}
                onClick={() => {
                  setImageArtist({
                    name,
                    key: artistId,
                    style,
                  });
                  document
                    .getElementById('justAboveTextField')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'end',
                      inline: 'nearest',
                    });
                }}
              />
            );
          })}
        </ArtistListLayout>
      </ArtistLayout>
      <SectionLayout>
        <Title
          text="Your Generated Images"
          sx={{ fontSize: '3rem', paddingTop: '2rem' }}
        />
        <Description text="Coming soon..." />
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
