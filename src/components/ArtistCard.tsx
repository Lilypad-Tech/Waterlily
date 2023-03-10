import { FC, ReactElement, useState } from 'react';
import { Watermark } from '@hirohe/react-watermark';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Link,
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
}

export const ArtistCard: FC<ArtistCardProps> = ({
  name,
  style,
  description,
  image,
  portfolio,
}): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={boxStyle}>
      <Card sx={{ maxWidth: 300 }}>
        <CardHeader
          title={name || 'Artist Name'}
          subheader={style || 'Artist Style'}
        />
        <Link
          href={portfolio || 'https://www.google.com'}
          target="_blank"
          rel="noreferrer"
        >
          <Watermark text={name || 'ArtistName'}>
            <CardMedia
              component="img"
              // height="250"
              image={image?.link || './monet-water-lilies.jpeg'}
              alt={image?.alt || 'Monet Water Lilies'}
              sx={{ pointerEvents: 'none' }}
            />
          </Watermark>
        </Link>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description || 'Artist Description'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
