import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {
  height: 'auto',
  width: '100%',
  padding: '20px',
  display: 'flex',
  flexFlow: 'wrap',
  justifyContent: 'center',
  overflow: 'hidden',
  overflowY: 'scroll',
};

export const ArtistListLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};
