import { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { Twitter } from '@mui/icons-material';
import { ImageContext } from '@/context';

export const TwitterLink = () => {
  const { twitterLink } = useContext(ImageContext);

  const handleTwitterButtonClick = () => {
    window.open(twitterLink, '_blank');
  };

  return (
    <Box sx={{ padding: '1rem 0' }}>
      <Button
        onClick={handleTwitterButtonClick}
        variant="outlined"
        startIcon={<Twitter />}
        aria-label="Share on Twitter"
      >
        Share on Twitter
      </Button>
    </Box>
  );
};
