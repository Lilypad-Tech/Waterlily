import { FC, ReactElement } from 'react';
import { Box } from '@mui/material';
import { appTitle } from '@/definitions/strings';

const titleStyle = {
  background:
    '-webkit-linear-gradient(right, #30ccff 10%, #30ccff, #0055ff 70%)',
  fontSize: '4rem',
  fontWeight: 'bold',
  backgroundSize: '100%',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  '-moz-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  '-moz-text-fill-color': 'transparent',
};

type TitleProps = {
  text?: string;
};

export const Title: FC<TitleProps> = ({ text }): ReactElement => {
  return <Box sx={titleStyle}>{text || appTitle}</Box>;
};
