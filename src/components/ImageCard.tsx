import { FC, ReactElement, useState } from 'react';
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

interface ImageCardProps {
  artist?: string;
  style?: string;
  prompt?: string;
  image?: { link: string; alt: string };
  ipfs?: { link: string; alt: string };
}

export const ImageCard: FC<ImageCardProps> = ({
  artist,
  style,
  prompt,
  image,
  ipfs,
}): ReactElement => {
  return (
    <Box sx={boxStyle}>
      <Card sx={{ maxWidth: 300 }}>
        <Link
          href={ipfs?.link || 'https://www.google.com'}
          target="_blank"
          rel="noreferrer"
        ></Link>
        <CardMedia
          component="img"
          height="150"
          image={image?.link || './monet-water-lilies.jpeg'}
          alt={image?.alt || 'Monet Water Lilies'}
        />
        <CardContent>
          <CardHeader
            title={artist || 'Artist Name'}
            subheader={style || 'Artist Style'}
          />
          <Typography variant="body2" color="text.secondary">
            {prompt || 'Prompt'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
