import { Box, Typography, Link } from '@mui/material';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { useNavigation } from '@/context';

//extend this params: href, text, navigate()?
export const CalloutMessage = () => {
  const { handleNavigation } = useNavigation();

  return (
    <Link href="/ArtistSignup">
      {/* target="_blank" rel="noopener noreferrer" */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '0.5rem',
          fontSize: '4rem',
          // color: '#f53ebb',
          // '-webkit-linear-gradient(right, #b583ff 10%, #f53ebb, #b583ff 70%)',
        }}
        onClick={() => handleNavigation('ArtistSignup')}
      >
        <Typography>Are you an Artist? Be featured!</Typography>
        <ArrowRightAltOutlinedIcon sx={{ paddingLeft: '0.5rem' }} />
      </Box>
    </Link>
  );
};
