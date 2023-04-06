import { useContext } from 'react';
import { Box } from '@mui/material';
import { defaultStatusState, StatusContext } from '@/context';

export const MessageStatus = () => {
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
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
  </Box>;
};
