import { useContext } from 'react';
import { CardMedia, Card, Grid, Typography } from '@mui/material';
import { ArtistData, ContractContext } from '@/context';

export const NFTDisplay = () => {
  const { nftImages } = useContext(ContractContext);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {nftImages.map((nft, idx) => {
        const { originalArtist } = nft.properties;
        const { name } = originalArtist as ArtistData;
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
              </Card>
              <Typography variant="caption">{name}</Typography>
            </Grid>
          );
        }
      })}
    </Grid>
  );
};
