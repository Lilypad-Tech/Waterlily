import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import {
  ContractContext,
  ArtistContext,
  ArtistData,
  ImageContext,
  IMAGE_NUMBER_ARRAY,
} from '@/context';
import { ImageQuickCard } from '@/components';

export const GeneratedImages = () => {
  const { customerImages } = useContext(ContractContext);
  const { getQuickImageURL } = useContext(ImageContext);
  const { findArtistById } = useContext(ArtistContext);
  return (
    <>
      {customerImages.map((image) => {
        // console.log('generated', image);
        const artist: ArtistData | null = findArtistById(image.artist);
        // console.log('generated artist', artist);
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
              {IMAGE_NUMBER_ARRAY.map((imageNumber, idx) => {
                // console.log('artist?', artist);
                const link = getQuickImageURL(image.id.toNumber(), imageNumber);
                const alt = artist
                  ? `${artist.name}-${image.id}-image${idx}`
                  : `${image.id}-image${idx}`;
                return (
                  <ImageQuickCard
                    image={{
                      link: link,
                      alt: alt,
                      minted: false,
                    }}
                    idx={imageNumber}
                    key={alt}
                  />
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
};
