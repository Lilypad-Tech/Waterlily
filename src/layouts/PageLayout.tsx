import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {
  minHeight: '100vh',
  overflow: 'scroll',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  margin: '1rem',
};

const PageLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};

export default PageLayout;
