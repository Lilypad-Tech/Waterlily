import { useContext, useEffect, useState } from 'react';
import { Box, Typography, Button, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
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
  // console.log('customerimages', customerImages);
  const reversedImages = [...customerImages].reverse();
  const [allImages, setAllImages] = useState([] as any[]);
  const imagesPerPage = 1;
  const totalImages = customerImages.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  useEffect(() => {
    const preloadImages = async () => {
      const promises: any[] = [];
      for (const el of reversedImages) {
        const artist: ArtistData | null = findArtistById(el.artist);

        let proms = IMAGE_NUMBER_ARRAY.map((imageNumber, idx) => {
          const link = getQuickImageURL(el.id.toNumber(), imageNumber);
          // console.log('link', link);
          const alt = artist
            ? `${artist.name}-${el.id}-image${idx}`
            : `${el.id}-image${idx}`;
          const img = new Image();
          img.src = link;
          img.alt = alt;
          return new Promise((resolve) => {
            img.onload = resolve;
          });
        });
        // console.log('proms', proms);

        const loadedImages = await Promise.all(proms); // wait for inner promises to resolve
        promises.push(loadedImages);
      }

      // console.log('promises', promises);
      setAllImages(promises);
    };
    preloadImages();
  }, []);

  // useEffect(() => {
  //   console.log('allImages', allImages);
  // }, [allImages]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep === totalPages - 1) {
        return 0;
      }
      const nextStep = prevActiveStep + 1;
      return nextStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep === 0) {
        return totalPages - 1;
      }
      const prevStep = prevActiveStep - 1;
      return prevStep;
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <MobileStepper
          steps={totalPages}
          position="static"
          activeStep={activeStep}
          variant="dots"
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={totalPages === 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={totalPages === 1}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Box>
      <Box>
        {reversedImages
          .slice(activeStep * imagesPerPage, (activeStep + 1) * imagesPerPage)
          .map((image, idx) => {
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
                    width: '100%',
                    minHeight: '200px',
                  }}
                >
                  {/* {allImages &&
                    allImages[idx].map((im, i) => {
                      <img src={im[i]} alt={im[i]} />;
                    })} */}
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
      </Box>
    </>
  );
};
