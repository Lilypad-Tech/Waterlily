import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { FooterLayout } from '@/layouts';

interface Props {
  children: ReactNode;
}

const style = {
  height: '100%',
  minHeight: '150vh',
  // overflow: 'scroll',
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
      {/* <FooterLayout /> */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '60%', fontSize: '0.75rem', fontStyle: 'italic' }}>
          “Never doubt that a small group of thoughtful, committed, citizens can
          change the world. Indeed, it is the only thing that ever has.” ―
          Margaret Mead
        </Box>
      </Box>
    </Box>
  );
};
