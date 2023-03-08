import { ReactElement, ReactNode, FC } from 'react';
import { Box } from '@mui/material';

const layoutStyle = {
  display: 'flex',
  width: '100%',
  padding: '20px',
  justifyContent: 'center',
  marginTop: 'auto',
};

type FooterProps = {
  children?: ReactNode;
};

export const FooterLayout: FC<FooterProps> = ({
  children,
}: FooterProps): ReactElement => {
  return (
    <Box sx={layoutStyle}>
      {/* Link below to a page with lilypad team faces & profiles if time */}
      {children} <Box>Made with ❤️ Lilypad Team</Box>
    </Box>
  );
};
