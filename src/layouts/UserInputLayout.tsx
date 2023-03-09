import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'pink',
  width: '100%',
  padding: '0 1rem 0 1rem',
  minHeight: '3rem',
};

export const UserInputLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};
