import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {};

export const ImageLayout = ({ children }: Props) => {
  return <Box>{children}</Box>;
};
