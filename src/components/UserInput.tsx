import { FC, ReactElement } from 'react';
import { Box, Typography } from '@mui/material';
// import { appUserInput } from '@/definitions/strings';

const UserInputStyle = {
  width: '100%',
  fontWeight: 'bold',
  whiteSpace: 'pre-line',
  fontFamily: 'fantasy',
  lineHeight: '1.7',
};
const boxStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

type UserInputProps = {};

export const UserInput: FC<UserInputProps> = (): ReactElement => {
  return (
    <Box sx={boxStyle}>
      <Typography variant="body1" sx={UserInputStyle}>
        UserInput
      </Typography>
    </Box>
  );
};
