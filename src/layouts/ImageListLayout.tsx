import { ReactNode, useContext } from 'react';
import { Box } from '@mui/material';
import { ImageContext } from '@/context';

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

// const style = {
//   height: 'auto',
//   width: '100%',
//   padding: '20px',
//   display: 'flex',
//   flexFlow: 'wrap',
//   justifyContent: 'center',
//   overflow: 'hidden',
//   // overflowY: 'scroll',
// };

const boxStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

export const ImageListLayout = ({ children }: Props) => {
  const { artist, prompt } = useContext(ImageContext);
  return <Box sx={boxStyle}>{children}</Box>;
};
