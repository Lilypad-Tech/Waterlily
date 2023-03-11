import { useState, useContext, useEffect } from 'react';
import {
  HeaderLayout,
  TitleLayout,
  SectionLayout,
  UserInputLayout,
  ImageLayout,
  ArtistListLayout,
} from '@/layouts';
import {
  Logo,
  Title,
  Subtitle,
  Description,
  MyButton,
  UserInput,
  ArtistCard,
  WalletButton,
} from '@/components';
import { artists } from '@/definitions/artists';
import { StableDiffusionContext, WalletContext } from '@/context';
import { CircularProgress } from '@mui/material';

const HomePage = () => {
  // const [isConnected, setConnected] = useState(false);
  const { walletState } = useContext(WalletContext);
  const { stableDiffusionState } = useContext(StableDiffusionContext);

  return (
    <>
      <HeaderLayout>
        <Logo height={40} />
        <WalletButton />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle />
        <Description />
      </TitleLayout>
      {/* <SectionLayout>
        <div>status updates ? use snack?</div>
      </SectionLayout> */}
      <SectionLayout>
        {!walletState?.isConnected ? (
          <WalletButton />
        ) : !stableDiffusionState?.isLoading ? (
          <UserInputLayout>
            <UserInput />
          </UserInputLayout>
        ) : (
          <CircularProgress size={100} />
        )}
      </SectionLayout>
      <ImageLayout>
        <Title text="Artists" sx={{ fontSize: '3rem', paddingTop: '2rem' }} />
        <ArtistListLayout>
          {artists.map((artist, e) => {
            const { name, style, description, portfolio, image } = artist;
            return (
              <ArtistCard
                key={e}
                name={name}
                style={style}
                description={description}
                portfolio={portfolio}
                image={image}
              />
            );
          })}
        </ArtistListLayout>
      </ImageLayout>
    </>
  );
};

export default HomePage;
