import { FC, ReactElement, useContext } from 'react';
import { Box, Button, Card, CardMedia, Link } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { ImageContext } from '@/context';

//ipfs.io/ipfs/{cid} should be fine?

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
  cursor: 'pointer',
};

const downloadStyle = {
  position: 'absolute',
  top: 20,
  right: 25,
  cursor: 'pointer',
};

interface ImageCardProps {
  image: { link: string; alt: string };
  ipfs?: { link: string; alt: string };
  idx: number | string;
}

export const ImageQuickCard: FC<ImageCardProps> = ({
  image,
  ipfs,
  idx,
}): ReactElement => {
  const { imageArtist, imagePrompt, downloadImage } = useContext(ImageContext);
  let noSpacePrompt = imagePrompt.replace(/\s+/g, '').trim();
  // let artistName = imageArtist.name.replace(/\s+/g, '').trim();
  const fileName = `${noSpacePrompt.slice(0, 20)}-Image_${idx}`;
  const folderName = imageArtist.name.replace(/\s+/g, '').trim();

  // const downloadImage = (imageUrl: string | undefined) => {
  //   if (!imageUrl) return;
  //   fetch(imageUrl)
  //     .then((response) => {
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       // FileSaver.saveAs(blob, fileName);
  //       FileSaver.saveAs(blob, `WaterlilyAI_${folderName}_${fileName}`);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={downloadStyle}
        onClick={() => downloadImage(image.link, folderName, fileName)}
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
