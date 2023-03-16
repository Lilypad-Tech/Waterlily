import { useContext } from 'react';
import { Box, Typography, CardMedia, Card } from '@mui/material';
import { ContractContext, ImageContext, IMAGE_NUMBER_ARRAY } from '@/context';
import { artists } from '@/definitions';

export const GeneratedImages = () => {
  const { customerImages } = useContext(ContractContext);
  const { getQuickImageURL } = useContext(ImageContext);
  return (
    <>
      {customerImages.map((image) => {
        const artist = artists.find((a) => a.artistId === image.artist);
        return (
          <Box
            key={image.id.toString()}
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 'solid 1px #fff',
              width: '800px',
              maxWidth: '800px',
            }}
          >
            <Typography gutterBottom variant="h6">
              {image.prompt}
            </Typography>
            <Typography gutterBottom>{artist?.name}</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: 2,
              }}
            >
              {IMAGE_NUMBER_ARRAY.map((imageNumber) => {
                return (
                  <Card
                    key={imageNumber}
                    sx={{
                      maxWidth: 250,
                      border: '1px solid white',
                      ml: 1,
                      mr: 1,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getQuickImageURL(image.id.toNumber(), imageNumber)}
                    />
                  </Card>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
};
