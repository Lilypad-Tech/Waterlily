import { FC, ReactElement, useState } from 'react';
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

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

interface ArtistCardProps {
  name?: string;
  style?: string;
  description?: string;
  image?: { link: string; alt: string };
  portfolio: string;
  onClick?: () => void;
}

export const ArtistCard: FC<ArtistCardProps> = ({
  name,
  style,
  description,
  image,
  portfolio,
  onClick,
}): ReactElement => {
  const [expanded, setExpanded] = useState(false);

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
        <Box sx={{
          height: '240px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          //backgroundColor: '#fff',
          mb: 2,
        }}>
          <Link
            href={portfolio}
            target="_blank"
            rel="noreferrer"
          >
            <Watermark text={name || 'ArtistName'}>
              <CardMedia
                component="img"
                // height="250"
                image={image?.link || './monet-water-lilies.jpeg'}
                alt={image?.alt || 'Monet Water Lilies'}
                sx={{
                  pointerEvents: 'none',
                  border: '1px solid #fff'
                }}
              />
            </Watermark>
          </Link>
        </Box>
        <CardContent sx={{
          height: '240px',
        }}>
          <Typography variant="body2" color="text.secondary">
            {description || 'Artist Description'}
          </Typography>
        </CardContent>
        <CardActions sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
          <Button
            variant="outlined"
            onClick={onClick}
          >
            Generate Image
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
