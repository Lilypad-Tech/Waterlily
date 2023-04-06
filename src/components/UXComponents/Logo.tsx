import { FC } from 'react';
import Image from 'next/image';
import { Images } from '@/assets';

const { src, alt } = Images.logoHorizontal;

type LogoProps = {
  height?: number;
  width?: number;
  href?: string;
};

export const Logo: FC<LogoProps> = ({ href, height, width }) => {
  return (
    <a href={href || 'https://waterlily.ai/'} target="_blank">
      <Image src={src} alt={alt} height={height} width={width} />
    </a>
  );
};
