import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {
  alignItems: 'center',
};

export const TitleLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};
