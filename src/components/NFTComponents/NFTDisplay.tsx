import { useContext } from 'react';
import { Box, CardMedia, Card, Grid, Typography } from '@mui/material';
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
          // width: '800px',
          // maxWidth: '800px',
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {nftImages.map((nft, idx) => {
            if (nft?.image) {
              return (
                <Grid
                  item
                  xs="auto" //{12}
                  sm="auto" //{6}
                  md="auto" //{3}
                  lg="auto" //{3}
                  xl="auto"
                  key={idx.toString()}
                >
                  <Card
                    key={idx}
                    sx={{
                      maxWidth: 200,
                      border: '1px solid white',
                      ml: 1,
                      mr: 1,
                      mt: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={nft.image || './monet-water-lilies.jpeg'}
                      alt={nft.name}
                    />
                    {/* <Typography></Typography> */}
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      </Box>
    </>
  );
};
