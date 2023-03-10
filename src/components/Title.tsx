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
  WebkitBackgroundClip: 'text',
  MozBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozTextFillColor: 'transparent',
};

type TitleProps = {
  text?: string;
  sx?: object;
};

export const Title: FC<TitleProps> = ({ text, sx }): ReactElement => {
  return <Box sx={{ ...titleStyle, ...sx }}>{text || appTitle}</Box>;
};
