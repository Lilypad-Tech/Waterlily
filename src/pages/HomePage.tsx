import { useState } from 'react';
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
} from '@/components';

const HomePage = () => {
  const [isConnected, setConnected] = useState(false);
  const [isGenerating, setGenerating] = useState(false);

  return (
    <>
      <HeaderLayout>
        <Logo height={40} />
        <MyButton
          action={() => setConnected(!isConnected)}
          name={isConnected ? 'connected' : 'connect'}
          background={isConnected ? 'connected' : 'connect'}
        />
      </HeaderLayout>
      <TitleLayout>
        <Title />
        <Subtitle />
        <Description />
      </TitleLayout>
      {/* <SectionLayout>
        <div>status updates? use snack?</div>
      </SectionLayout> */}
      <SectionLayout>
        {!isConnected ? (
          <MyButton
            action={() => setConnected(!isConnected)}
            name={isConnected ? 'connected' : 'connect'}
            background={isConnected ? 'connected' : 'connect'}
          />
        ) : (
          <UserInputLayout>
            <UserInput />
          </UserInputLayout>
        )}
      </SectionLayout>
      <ImageLayout>
        <Title text="Artists" sx={{ fontSize: '3rem' }} />
        <ArtistListLayout>
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
        </ArtistListLayout>
      </ImageLayout>
    </>
  );
};

export default HomePage;
