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
      {/* {children}{' '}
      <Box
        sx={{
          border: '1px solid white',
          borderRadius: '10px',
          padding: '1rem',
        }}
        onClick={() =>
          window.open('https://github.com/bacalhau-project/lilypad', '_blank')
        }
      >
        Made with ❤️ Lilypad Team
      </Box> */}
    </Box>
  );
};
