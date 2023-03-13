import { ReactNode, useContext } from 'react';
import { Box } from '@mui/material';

interface Props {
  // artist: string;
  // prompt: string;
  children: ReactNode;
}
const style = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

const boxStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

export const ImageListLayout = ({ children }: Props) => {
  return <Box sx={boxStyle}>{children}</Box>;
};
