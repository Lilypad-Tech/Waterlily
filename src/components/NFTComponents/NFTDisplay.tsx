import { useContext } from 'react';
import { Box, CardMedia, Card } from '@mui/material';
import { ContractContext } from '@/context';

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
          {nftImages.map((nft, idx) => {
            if (nft?.image) {
              return (
                <Card
                  key={idx}
                  sx={{
                    maxWidth: 250,
                    border: '1px solid white',
                    ml: 1,
                    mr: 1,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={nft?.image || './monet-water-lilies.jpeg'}
                    alt={nft.name}
                  />
                </Card>
              );
            }
          })}
        </Box>
      </Box>
    </>
  );
};
