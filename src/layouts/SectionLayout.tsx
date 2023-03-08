import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = {};

export const SectionLayout = ({ children }: Props) => {
  return <Box>{children}</Box>;
};
