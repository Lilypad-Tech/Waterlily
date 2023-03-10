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
import { artists } from '@/definitions/artists';

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
