import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { ImageContext } from '@/context';
import { Subtitle } from '.';

export const ImageHeader = () => {
  const { imagePrompt, imageArtist } = useContext(ImageContext);
  return (
    <Box
      key={imageArtist.key}
      sx={{ display: 'flex', flexDirection: 'column', paddingTop: '2rem' }}
    >
      <Subtitle text="Generated Images" />
      <Typography
        variant="h6"
        sx={{ paddingTop: '1rem' }}
      >{`${imagePrompt}`}</Typography>
      <Typography variant="subtitle1">{`${imageArtist.name}`}</Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ display: 'block', fontWeight: 'bold' }}
      >
        {`${imageArtist.style}`}
      </Typography>
    </Box>
  );
};
