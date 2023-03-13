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
import {
  WalletContext,
  defaultWalletState,
  StatusContext,
  defaultStatusState,
} from '@/context';
import { CircularProgress } from '@mui/material';

const HomePage = () => {
  // const [isConnected, setConnected] = useState(false);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);

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
      {/* <SectionLayout>
        <div>status updates ? use snack?</div>
      </SectionLayout> */}
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
