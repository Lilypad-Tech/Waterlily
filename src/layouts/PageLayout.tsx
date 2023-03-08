import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { FooterLayout } from '@/layouts';

interface Props {
  children: ReactNode;
}

const style = {
  height: '100%',
  minHeight: '150vh',
  overflow: 'scroll',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  margin: '1rem',
};

export const PageLayout = ({ children }: Props) => {
  return (
    <Box sx={style}>
      {children}
      <FooterLayout />
    </Box>
  );
};
