import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const style = { padding: '1rem 0 1rem 0' };

export const SectionLayout = ({ children }: Props) => {
  return <Box sx={style}>{children}</Box>;
};
