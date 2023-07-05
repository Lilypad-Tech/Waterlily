import { FC, ReactElement } from 'react';
import { Box, Typography, Link } from '@mui/material';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';

const boxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1rem',
};

type DescriptionProps = {
  text?: string;
};

export const Description: FC<DescriptionProps> = ({ text }): ReactElement => {
  return (
    <Box sx={boxStyle}>
      <Typography variant="h6">Artists Create Astonishing Value.</Typography>
      <Typography variant="h6">They deserve to be paid.</Typography>
      {/* <Typography variant="body1">100% goes to creators </Typography> */}
      <Link
        href="https://www.notion.so/lilypadnetwork/Waterlily-ai-433c70993c0c4af4a9b5a562f42292c3"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '0.5rem',
          }}
        >
          <Typography>See How it Works</Typography>
          <ArrowRightAltOutlinedIcon />
        </Box>
      </Link>
      {/* <Typography variant="body1" sx={descriptionStyle}>
        {text || appDescription}
      </Typography> */}
    </Box>
  );
};
