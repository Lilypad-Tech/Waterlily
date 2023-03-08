import {
  HeaderLayout,
  TitleLayout,
  SectionLayout,
  ImageLayout,
} from '@/layouts';
import { Logo, Title } from '@/components';

const HomePage = () => {
  return (
    <>
      <HeaderLayout>
        <Logo height={30} />
        <div>wallet</div>
      </HeaderLayout>
      <TitleLayout>
        <Title text="ArtisteLys" />
        <div>Description on multiple lines</div>
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
