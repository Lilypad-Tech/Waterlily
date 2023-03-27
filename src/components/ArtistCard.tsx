import { FC, ReactElement, useState, useContext } from 'react';
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
  const [expanded, setExpanded] = useState(false);
  const { walletState } = useContext(WalletContext);

  return (
    <Box sx={boxStyle}>
      <Card sx={{ maxWidth: 300 }}>
        <CardHeader
          title={artist.name || 'Artist Name'}
          subheader={artist.style || 'Artist Style'}
          sx={{
            height: '120px',
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
            mb: 2,
          }}
        >
          <Link href={artist.portfolio} target="_blank" rel="noreferrer">
            <Watermark text={artist.name || 'ArtistName'}>
              <CardMedia
                component="img"
                // height="250"
                image={
                  artist.thumbnails[0]?.link || './monet-water-lilies.jpeg'
                }
                alt={artist.thumbnails[0]?.alt || 'Monet Water Lilies'}
                sx={{
                  pointerEvents: 'none',
                  border: '1px solid #fff',
                }}
              />
            </Watermark>
          </Link>
        </Box>
        <CardContent
          sx={{
            height: '240px',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {artist.description || 'Artist Description'}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
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
