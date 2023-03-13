import { useState, useContext, useEffect } from 'react';
import {
  HeaderLayout,
  TitleLayout,
  SectionLayout,
  UserInputLayout,
  ArtistLayout,
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
import { CircularProgress } from '@mui/material';
import { ImageCard } from '@/components/ImageCard';

const ipfsRoot = 'https://ipfs.io/ipfs/';

const HomePage = () => {
  // const [isConnected, setConnected] = useState(false);
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  const { imageState, quickImages } = useContext(ImageContext);

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
      {imageState.generatedImages && (
        <SectionLayout>
          <ImageHeader />
          <ImageListLayout>
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_0.png`,
                alt: 'Not seen',
              }}
            />
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_1.png`,
                alt: 'Not seen',
              }}
            />
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_2.png`,
                alt: 'Not seen',
              }}
            />
            <ImageCard
              ipfs={{
                link: `${ipfsRoot}${
                  // 'QmbQ3FwfwTtLmN9oL1so6QKHDTK3CagJx8djsvcz7Ghnmp' ||
                  imageState.generatedImages.ipfsResult
                }/outputs/image_3.png`,
                alt: 'Not seen',
              }}
            />
          </ImageListLayout>
        </SectionLayout>
      )}
      {quickImages && (
        <SectionLayout>
          <ImageHeader />
          <ImageListLayout>
            {quickImages.map((elmt) => {
              return (
                <ImageCard
                  image={{
                    link: elmt,
                    alt: 'Not seen',
                  }}
                />
              );
            })}
          </ImageListLayout>
        </SectionLayout>
      )}
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
      <ArtistLayout>
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
      </ArtistLayout>
    </>
  );
};

export default HomePage;
