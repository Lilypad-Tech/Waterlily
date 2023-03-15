import { useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { StatusContext, defaultStatusState } from '@/context';

export const StatusMessage = () => {
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  return (
    <Box sx={{ padding: '0 1rem' }}>
      <CircularProgress size={80} />
      <div>{statusState.isLoading}</div>
      {statusState.isMessage && (
        <div>
          <div>{statusState.message?.title}</div>
          <div>{statusState.message?.description}</div>
        </div>
      )}
    </Box>
  );
};
