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
} from '@mui/material';
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            //backgroundColor: '#fff',
            // mb: 1,
          }}
        >
          {/* TODO: link should open a modal with their generated art examples */}
          <Link href={artist.portfolio} target="_blank" rel="noreferrer">
            {/* <Watermark text={artist.name || 'ArtistName'}> */}
            <CardMedia
              component="img"
              height={220}
              image={artist.thumbnails[0].link || './monet-water-lilies.jpeg'}
              alt={artist?.thumbnails[0]?.alt || 'Monet Water Lilies'}
              sx={{
                pointerEvents: 'none',
                border: '1px solid #fff',
                padding: 0,
                margin: 0,
                objectFit: 'scale-down',
              }}
            />
            {/* </Watermark> */}
          </Link>
        </Box>
        <CardContent
          sx={{
            height: '264px',
            padding: '0 1rem',
          }}
        >
          <Typography sx={{ padding: 0, paddingBottom: '0.3rem' }}>
            {artist.style || 'Artist Style'}
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {artist.tags.length > 0 &&
              artist.tags.map((tag) => {
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
