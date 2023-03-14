import { FC, ReactElement } from 'react';
import { Box, SxProps } from '@mui/material';
import { appTitle } from '@/definitions/strings';
import { keyframes } from '@emotion/react';

const animatedText = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const titleStyle = {
  background:
    '-webkit-linear-gradient(right, #30ccff 10%, #30ccff, #0055ff 70%)',
  fontSize: '4rem',
  fontWeight: 'bold',
  backgroundSize: '100%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  MozBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozTextFillColor: 'transparent',
  backgroundRepeat: 'repeat',
  animation: `${animatedText} 2s linear infinite`,
};

type TitleProps = {
  text?: string;
  sx?: SxProps;
};

export const Title: FC<TitleProps> = ({ text, sx }): ReactElement => {
  return (
    <Box component="div" sx={{ ...titleStyle, ...sx }}>
      {text || appTitle}
    </Box>
  );
};
