import { Button, Link, Box, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';

//TODO: should be a button
export const TwitterLink = (twitterLink: any) => {
  return (
    <Box
      sx={{
        marginTop: '1rem',
        padding: '0.6rem',
        display: 'inline-block',
        border: '1px solid rgba(255, 255,255, 0.4)',
        borderRadius: '10px',
        '&:hover': {
          border: '2px solid #0055ff',
          cursor: 'pointer',
        },
      }}
    >
      <Link
        href={twitterLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ textDecoration: 'none' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TwitterIcon />
          <Typography color="white" sx={{ paddingLeft: '10px' }}>
            Share on Twitter
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

/*
    <Button
      variant="outlined"
      sx={{
        // marginTop: '1rem',
        // padding: '1rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // border: '1px solid rgba(255, 255, 255, 0.4)',
        // borderRadius: '10px',
        // '&:hover': {
        //   border: '2px solid #0055ff',
        //   cursor: 'pointer',
        // },
      }}
      component={Link}
      href={twitterLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Typography sx={{ color: 'white' }}>
        <TwitterIcon sx={{ paddingRight: '10px' }} />
        Share on Twitter
      </Typography>
    </Button>
*/
