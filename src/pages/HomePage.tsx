import { useState, useContext, useEffect } from 'react';
import {
  HeaderLayout,
  TitleLayout,
  SectionLayout,
  UserInputLayout,
  ImageLayout,
  ArtistListLayout,
  ImageListLayout,
} from '@/layouts';
import {
  Logo,
  Title,
  Subtitle,
  Description,
  UserInput,
  ArtistCard,
  WalletButton,
  ImageHeader,
} from '@/components';
import { artists } from '@/definitions/artists';
import {
  WalletContext,
  defaultWalletState,
  StatusContext,
  defaultStatusState,
  ImageContext,
} from '@/context';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ImageCard } from '@/components/ImageCard';

const HomePage = () => {
  // const [isConnected, setConnected] = useState(false);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  const { imageState, setImageState } = useContext(ImageContext);

  useEffect(() => {
    console.log('status home', statusState);
  }, [statusState]);

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
      <SectionLayout>
        <ImageHeader />
        <ImageListLayout>
          <ImageCard />
          <ImageCard />
          <ImageCard />
          <ImageCard />
        </ImageListLayout>
      </SectionLayout>
      <SectionLayout>
        {!walletState?.isConnected ? (
          <WalletButton />
        ) : !Boolean(statusState.isLoading) ? (
          <UserInputLayout>
            <UserInput />
          </UserInputLayout>
        ) : (
          <>
            {/* TO DO BREAK OUT INTO PROPER COMPONENT */}
            <CircularProgress size={100} />
            <div>{statusState.isLoading}</div>
            {statusState.isMessage && (
              <div>
                <div>{statusState.message?.title}</div>
                <div>{statusState.message?.description}</div>
              </div>
            )}
          </>
        )}
      </SectionLayout>
      <ImageLayout>
        <Title
          text="Featured Artists"
          sx={{ fontSize: '3rem', paddingTop: '2rem' }}
        />
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
