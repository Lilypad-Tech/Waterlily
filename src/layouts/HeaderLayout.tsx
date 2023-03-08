import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {
  display: 'flex',
  flexDirection: 'row',
  padding: '0.8rem 1.5rem 0.8rem 1.5rem',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const HeaderLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};
