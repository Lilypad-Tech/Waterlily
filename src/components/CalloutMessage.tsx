import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';

type CalloutMessageProps = {
  children?: ReactNode;
  text: string;
  onClick: any;
};

const calloutStyle = {
  width: '100%',
  display: 'flex',
  padding: '1rem',
  alignItems: 'center',
  justifyContent: 'center',
  // fontSize: '4rem',
  // fontWeight: 'bold',
  // backgroundSize: '100%',
  // backgroundClip: 'text',
  // WebkitBackgroundClip: 'text',
  // MozBackgroundClip: 'text',
  // WebkitTextFillColor: 'transparent',
  // MozTextFillColor: 'transparent',
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  border: '1px solid white',
  borderRadius: '10px',
  width: '40%',
  fontSize: '4rem',
  fontWeight: 'bold',
  background:
    '-webkit-linear-gradient(right, #b583ff 10%, #f53ebb, #b583ff 70%)',
  backgroundSize: '100%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  MozBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozTextFillColor: 'transparent',
};

export const CalloutMessage: FC<CalloutMessageProps> = ({
  text,
  children,
  onClick,
}) => {
  return (
    <Box onClick={onClick} sx={calloutStyle}>
      <Box sx={contentStyle}>
        <PaletteOutlinedIcon sx={{ marginRight: '1rem' }} />
        <Typography>{text}</Typography>
      </Box>
      {children}
    </Box>
  );
};
