import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginTop: '1rem',
};

export const UserInputLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};
