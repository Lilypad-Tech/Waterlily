import { FC, ReactElement } from 'react';
import { Box, Card, CardMedia, Link } from '@mui/material';
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
  if (!ipfs?.link) {
    return <div>no link given</div>;
  }
  return (
    <Box sx={{ position: 'relative' }}>
      {/* <Box sx={downloadStyle}>
        <CloudDownloadIcon />
      </Box> */}
      <Box sx={boxStyle}>
        <Card sx={{ maxWidth: 200, border: '1px solid white' }}>
          <Link
            href={ipfs?.link || 'https://www.google.com'}
            target="_blank"
            rel="noreferrer"
          ></Link>
          <CardMedia
            component="img"
            // height="200"
            image={ipfs?.link}
            alt={image?.alt || 'Monet Water Lilies'}
          />
        </Card>
      </Box>
    </Box>
  );
};

/*
  async function download(url) {
    const a = document.createElement("a");
    a.href = await toDataURL(url);
    a.download = "myImage.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function toDataURL(url) {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  }

  function onClick() {
    download("https://github.githubassets.com/images/modules/profile/badge--acv-64.png");
  }
*/
