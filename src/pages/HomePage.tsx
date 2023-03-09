import { useState } from 'react';
import {
  HeaderLayout,
  TitleLayout,
  SectionLayout,
  ImageLayout,
} from '@/layouts';
import { Logo, Title, Subtitle, Description, MyButton } from '@/components';

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
      <SectionLayout>
        <div>status updates? use snack?</div>
      </SectionLayout>
      <SectionLayout>
        <div>changeable - prompt input or wallet connect</div>
      </SectionLayout>
      <ImageLayout>
        <div>header title</div>
        <div>artist portfolio</div>
      </ImageLayout>
      <div>Take me home</div>
    </>
  );
};

export default HomePage;
