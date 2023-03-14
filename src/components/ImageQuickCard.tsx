import { FC, ReactElement } from 'react';
import { Box, Button, Card, CardMedia, Link } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { artists } from '@/definitions';

//ipfs.io/ipfs/{cid} should be fine?

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

const downloadStyle = {
  position: 'absolute',
  top: 20,
  right: 25,
};

interface ImageCardProps {
  image?: { link: string; alt: string };
  ipfs?: { link: string; alt: string };
}

export const ImageQuickCard: FC<ImageCardProps> = ({
  image,
  ipfs,
}): ReactElement => {
  return (
    <Box sx={{ position: 'relative' }}>
      {/* <Box sx={downloadStyle}>
        <CloudDownloadIcon />
      </Box> */}
      <Box sx={boxStyle}>
        <Card sx={{ maxWidth: 200, border: '1px solid white' }}>
          <Link
            href={image?.link || 'https://www.google.com'}
            target="_blank"
            rel="noreferrer"
          ></Link>
          <CardMedia
            component="img"
            // height="200"
            image={image?.link || './monet-water-lilies.jpeg'}
            alt={image?.alt || 'Monet Water Lilies'}
          />
        </Card>
      </Box>
      <Button variant="outlined" onClick={() => alert('Feature coming soon!')}>
        Mint as NFT
      </Button>
    </Box>
  );
};
