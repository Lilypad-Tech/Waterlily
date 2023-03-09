import { FC, ReactElement } from 'react';
import { Box, Typography } from '@mui/material';
import { appDescription } from '@/definitions/strings';

const descriptionStyle = {
  width: '100%',
  fontWeight: 'bold',
  whiteSpace: 'pre-line',
  // fontFamily: 'fantasy',
  lineHeight: '1.7',
};
const boxStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

type DescriptionProps = {
  text?: string;
};

export const Description: FC<DescriptionProps> = ({ text }): ReactElement => {
  return (
    <Box sx={boxStyle}>
      <Typography variant="body1" sx={descriptionStyle}>
        {text || appDescription}
      </Typography>
    </Box>
  );
};
