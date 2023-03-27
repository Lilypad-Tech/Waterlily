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
import { WalletContext } from '@/context';

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
  name?: string;
  style?: string;
  description?: string;
  disabled?: boolean;
  thumbnails: ImageThumbnail[];
  portfolio: string;
  onClick?: () => void;
}

export const ArtistCard: FC<ArtistCardProps> = ({
  name,
  style,
  description,
  disabled = false,
  thumbnails,
  portfolio,
  onClick,
}): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const { walletState } = useContext(WalletContext);

  return (
    <Box sx={boxStyle}>
      <Card sx={{ maxWidth: 300 }}>
        <CardHeader
          title={name || 'Artist Name'}
          subheader={style || 'Artist Style'}
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
          <Link href={portfolio} target="_blank" rel="noreferrer">
            <Watermark text={name || 'ArtistName'}>
              <CardMedia
                component="img"
                // height="250"
                image={thumbnails[0].link || './monet-water-lilies.jpeg'}
                alt={thumbnails[0].alt || 'Monet Water Lilies'}
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
            {description || 'Artist Description'}
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
