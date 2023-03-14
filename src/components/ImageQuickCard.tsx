import { FC, ReactElement, useContext } from 'react';
import { Box, Button, Card, CardMedia, Link } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import * as FileSaver from 'file-saver';
import { ImageContext } from '@/context';
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
  idx: any;
}

export const ImageQuickCard: FC<ImageCardProps> = ({
  image,
  ipfs,
  idx,
}): ReactElement => {
  const { imageArtist, imagePrompt } = useContext(ImageContext);
  console.log('idx', idx);

  const downloadImage = (
    imageUrl: string | undefined,
    fileName?: string,
    folderName?: string
  ) => {
    if (!imageUrl) return;
    fetch(imageUrl)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        let promptWithoutSpaces = imagePrompt.replace(/\s+/g, '').trim();
        let shortenedPrompt = promptWithoutSpaces.slice(0, 20);
        FileSaver.saveAs(blob, `${shortenedPrompt}-Image_${idx}`);
        // FileSaver.saveAs(blob, `${folderName}/${fileName}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={downloadStyle}
        onClick={() => downloadImage(image?.link, 'Name')}
      >
        <CloudDownloadIcon />
      </Box>
      <Box sx={boxStyle}>
        <Card sx={{ maxWidth: 200, border: '1px solid white' }}>
          <Link
            href={image?.link || 'https://twitter.com/DeveloperAlly'}
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
      {/* <Button variant="outlined" onClick={() => alert('Feature coming soon!')}>
        Mint as NFT
      </Button> */}
    </Box>
  );
};
