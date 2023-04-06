import { useContext } from 'react';
import { defaultStatusState, StatusContext } from '@/context';
import { Box } from '@mui/material';
import { StatusMessage, MessageStatus, ErrorMessage } from '..';
import { SectionLayout } from '@/layouts';

export const StatusDisplay = () => {
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  return (
    <>
      {statusState.isLoading ? (
        <Box sx={{ paddingTop: '2rem' }}>
          <StatusMessage />
        </Box>
      ) : statusState.isMessage ? (
        <MessageStatus />
      ) : statusState.isError ? (
        <SectionLayout>
          <ErrorMessage />
        </SectionLayout>
      ) : null}
    </>
  );
};
