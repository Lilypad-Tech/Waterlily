import { useContext } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { StatusContext, defaultStatusState } from '@/context';

export const StatusMessage = () => {
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  return (
    <Box
      sx={{
        padding: '0 1rem',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* {Boolean(statusState.isLoading) && ( */}
      <Box flexDirection="column">
        <CircularProgress size={80} />
        <div>{statusState.isLoading}</div>
      </Box>
      {/* )} */}
      {statusState.isMessage && (
        <Box
          sx={{
            border: '1px solid #b583ff',
            borderRadius: '10px',
            padding: '1rem',
            width: '70%',
          }}
        >
          <div>{statusState.message?.title}</div>
          <div>{statusState.message?.description}</div>
        </Box>
      )}
    </Box>
  );
};

export const ErrorMessage = () => {
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ paddingTop: '1rem' }}>
        <Typography variant="h5">{statusState.isError}</Typography>
      </div>
    </Box>
  );
};
