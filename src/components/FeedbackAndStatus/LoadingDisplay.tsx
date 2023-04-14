import { FC, ReactElement } from 'react';
import {
  // Modal,
  // Backdrop,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'; //could be good here

interface Status {
  error: ReactElement | string; //reactElement or string
  success: ReactElement | string;
  warning: ReactElement | string;
  loading: ReactElement | string;
}

type LoadingDisplayProps = {
  status: Status;
  setStatus?: Function;
};

export const LoadingDisplay: FC<LoadingDisplayProps> = ({ status }) => {
  const flag = typeof status.loading;

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <CircularProgress
        sx={{
          color: '#30ccff',
          marginBottom: '1rem',
        }}
        size={100}
      />
      {flag === 'string' ? (
        <Typography fontSize={40}>{status.loading}</Typography>
      ) : (
        status.loading
      )}
    </Box>
  );
};
