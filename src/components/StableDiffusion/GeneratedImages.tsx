import { useContext, useState } from 'react';
import { Box, Typography, Pagination, MobileStepper } from '@mui/material';
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
  const [activeStep, setActiveStep] = useState(0);
  const imagesPerPage = 1;
  const totalImages = customerImages.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const reversedImages = [...customerImages].reverse();

  // Create an array of image URLs
  const imageUrls = customerImages
    .map((image) => {
      return IMAGE_NUMBER_ARRAY.map((imageNumber, idx) => {
        const link = getQuickImageURL(image.id.toNumber(), imageNumber);
        return link;
      });
    })
    .flat();

  // Load all the images
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  return (
    <Box>
      {reversedImages
        .slice(activeStep * imagesPerPage, (activeStep + 1) * imagesPerPage)
        .map((image) => {
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
                  const link = getQuickImageURL(
                    image.id.toNumber(),
                    imageNumber
                  );
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
                      newImg={true}
                    />
                  );
                })}
              </Box>
            </Box>
          );
        })}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <MobileStepper
          steps={totalPages}
          position="static"
          activeStep={activeStep}
          variant="dots"
          nextButton={
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
              onClick={handleNext}
              disabled={activeStep === totalPages - 1}
            >
              <Typography variant="button">Next</Typography>
            </Box>
          }
          backButton={
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <Typography variant="button">Back</Typography>
            </Box>
          }
        />
      </Box>
    </Box>
  );
};
