import { FC, ReactElement, useState, useContext, useEffect } from 'react';
import { Watermark } from '@hirohe/react-watermark';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Link,
  Button,
  Stack,
  Chip,
  MobileStepper,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { WalletContext, ArtistData } from '@/context';

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

type ImageThumbnail = {
  link: string;
  alt: string;
};
//TO DO fix this to work off artists definitions
interface ArtistCardProps {
  artist: ArtistData;
  disabled?: boolean;
  onClick?: () => void;
}

export const ArtistCard: FC<ArtistCardProps> = ({
  artist,
  disabled = false,
  onClick,
}): ReactElement => {
  const { walletState } = useContext(WalletContext);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = artist.thumbnails.length;

  useEffect(() => {
    console.log('artist', artist);
  }, []);

  const subHeader = () => {
    return (
      <>
        <Typography sx={{ padding: 0 }}>
          {artist.period || 'Unknown'}
        </Typography>
        <Typography sx={{ padding: 0 }}>
          {artist.style || 'Artist Style'}
        </Typography>
      </>
    );
  };

  return (
    <Box sx={boxStyle}>
      <Card sx={{ maxWidth: 300, padding: 0, margin: 0 }}>
        <CardHeader
          title={artist.name || 'Artist Name'}
          subheader={
            <>
              <Typography sx={{ padding: 0 }}>
                {artist.period || 'Unknown'}
              </Typography>
              <Typography sx={{ padding: 0, fontSize: '0.8rem' }}>
                {artist.nationality || 'Nationality'}
              </Typography>
            </>
          }
          sx={{
            height: '120px',
            padding: '0.5rem',
            paddingTop: '1rem',
          }}
        />
        <Box
          sx={{
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            //backgroundColor: '#fff',
            // mb: 1,
          }}
        >
          {/* TODO: link should open a modal with their generated art examples */}
          {/* <Link href={artist.portfolio} target="_blank" rel="noreferrer"> */}
          {/* <Watermark text={artist.name || 'ArtistName'}> */}
          <CardMedia
            component="img"
            // height={210}
            image={
              artist.thumbnails[activeStep].link || './monet-water-lilies.jpeg'
            }
            alt={artist?.thumbnails[activeStep]?.alt || 'Monet Water Lilies'}
            sx={{
              pointerEvents: 'none',
              '& .MuiCardMedia-img': {
                border: '1px solid #fff',
              }, //not working
              padding: 0,
              margin: 0,
              maxHeight: 200,
              minWidth: 280,
            }}
          />
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{
              width: '100%',
              position: 'relative',
              top: '-1rem',
              padding: 0,
              background: 'transparent',
              height: 0,
            }}
            nextButton={
              <Button
                size="small"
                onClick={() =>
                  setActiveStep((prevActiveStep) => prevActiveStep + 1)
                }
                disabled={activeStep === maxSteps - 1}
                // sx={{ color: 'black' }}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={() =>
                  setActiveStep((prevActiveStep) => prevActiveStep - 1)
                }
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
          <Link
            href={artist.portfolio}
            target="_blank"
            rel="noreferrer"
            sx={{ paddingTop: '0.5rem' }}
          >
            <Typography variant="subtitle2">Artist Portfolio</Typography>
          </Link>
          {/* </Watermark> */}
          {/* </Link> */}
        </Box>
        <CardContent
          sx={{
            height: '275px',
            padding: '0.5rem',
          }}
        >
          {/* <Typography sx={{ padding: 0, paddingBottom: '0.3rem' }}>
            {artist.style || 'Artist Style'}
          </Typography> */}
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {artist.tags.length > 0 &&
              artist.tags.map((tag) => {
                if (tag === '') return;
                return (
                  <Box mr={1} mb={0.5}>
                    <Chip label={tag} variant="outlined" size="small" />
                  </Box>
                );
              })}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {artist.biography || 'Artist Description'}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: '1rem',
          }}
        >
          {walletState?.isConnected && (
            <Button variant="outlined" disabled={disabled} onClick={onClick}>
              Use This Style
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};
