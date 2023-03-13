import { Subtitle } from '.';
import { Box, Typography } from '@mui/material';

export const ImageHeader = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: '2rem' }}>
      <Subtitle text="Generated Images" />
      <Typography variant="h6">{'Artist Name'}</Typography>
      <Typography variant="subtitle1">{'Artist Style'}</Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block' }}
      >
        {
          'A really really long Prompt that someone has input like 2 dogs playing tennis while a rainbow unicorn adjudicates'
        }
      </Typography>
    </Box>
  );
};
