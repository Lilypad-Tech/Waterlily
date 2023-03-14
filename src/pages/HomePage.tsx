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
  ParrotLoader,
} from '@/components';
import { artists } from '@/definitions/artists';
import {
  ContractContext,
  WalletContext,
  defaultWalletState,
  StatusContext,
  defaultStatusState,
  ImageContext,
} from '@/context';
import {
  IMAGE_NUMBER_ARRAY,
  getQuickImageURL,
} from '../context/ImageContextProvider'
import { ImageQuickCard } from '@/components';
import { CircularProgress, Box, Typography, Card, CardMedia } from '@mui/material';
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
  const {
    customerImages,
  } = useContext(ContractContext)

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
      {quickImages.length > 0 && (
        <SectionLayout>
          <ImageHeader />
          <ImageListLayout>
            {quickImages.filter(i => i.indexOf('combined') > 0 ? false : true).map((quickImageURL, idx) => {
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
          <ImageListLayout>
            {quickImages.filter(i => i.indexOf('combined') > 0 ? true : false).map((quickImageURL, idx) => {
              return (
                <ImageQuickCard
                  key={idx}
                  idx={idx}
                  image={{
                    link: quickImageURL,
                    alt: 'Not found',
                  }}
                  sx={{
                    maxWHeight: 250,
                    border: '1px solid white',
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
            <ParrotLoader />
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
        <>
          <Title
            text="Your Generated Images"
            sx={{ fontSize: '3rem', paddingTop: '2rem' }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
          {
            customerImages.map((image) => {
              const artist = artists.find(a => a.artistId === image.artist)
              return (
                <Box
                  key={ image.id.toString() }
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: 'solid 1px #fff',
                    width: '800px',
                    maxWidth: '800px',
                  }}
                >
                  <Typography gutterBottom variant="h6">{image.prompt}</Typography>
                  <Typography gutterBottom>{artist?.name}</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      mt: 2,
                    }}
                  >
                    {
                      IMAGE_NUMBER_ARRAY.map(imageNumber => {
                        return (
                          <Card sx={{
                            maxWidth: 250,
                            border: '1px solid white',
                            ml: 1,
                            mr: 1,
                          }}>
                            <CardMedia
                              component="img"
                              image={ getQuickImageURL(image.id.toNumber(), imageNumber) }
                            />
                          </Card>
                        )
                      }) 
                    }
                  </Box>
                </Box>
              )
              
            })
          }
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
