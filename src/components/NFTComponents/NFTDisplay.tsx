import { useContext, useEffect } from 'react';
import { Box, Typography, CardMedia, Card } from '@mui/material';
import { ContractContext, ImageContext, IMAGE_NUMBER_ARRAY } from '@/context';
import { artists } from '@/definitions';

export const NFTDisplay = () => {
  const { nftImages } = useContext(ContractContext);

  return (
    <>
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: 'solid 1px #020202',
          width: '800px',
          maxWidth: '800px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mt: 2,
          }}
        >
          {nftImages.map((nft) => {
            if (nft?.image) {
              return (
                <Card
                  key={nft.image}
                  sx={{
                    maxWidth: 250,
                    border: '1px solid white',
                    ml: 1,
                    mr: 1,
                  }}
                >
                  <CardMedia component="img" image={nft.image} />
                </Card>
              );
            }
          })}
        </Box>
      </Box>
    </>
  );
};
