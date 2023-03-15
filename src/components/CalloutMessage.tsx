import { FC } from 'react';
import { Box, Typography, Link } from '@mui/material';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';

// type CalloutMessageProps = {
//   children?: ReactNode;
//   text?: string;
//   onClick?: any;
//   setCallout?: Dispatch<SetStateAction<boolean>>;
// };

// const calloutStyle = {
//   width: '100%',
//   display: 'inline-flex',
//   padding: '1rem',
//   alignItems: 'center',
//   justifyContent: 'center',
//   // fontSize: '4rem',
//   // fontWeight: 'bold',
//   // backgroundSize: '100%',
//   // backgroundClip: 'text',
//   // WebkitBackgroundClip: 'text',
//   // MozBackgroundClip: 'text',
//   // WebkitTextFillColor: 'transparent',
//   // MozTextFillColor: 'transparent',
// };

// const contentStyle = {
//   color: 'white',
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '1rem',
//   border: '1px solid white',
//   borderRadius: '10px',
//   // width: '50%',
//   fontSize: '4rem',
//   fontWeight: 'bold',
//   background:
//     '-webkit-linear-gradient(right, #b583ff 10%, #f53ebb, #b583ff 70%)',
//   backgroundSize: '100%',
//   backgroundClip: 'text',
//   WebkitBackgroundClip: 'text',
//   MozBackgroundClip: 'text',
//   WebkitTextFillColor: 'transparent',
//   MozTextFillColor: 'transparent',
//   position: 'relative',
//   color: '#30ccff',
//   '&:hover': {
//     background:
//       '-webkit-linear-gradient(right, #30ccff 10%, #30ccff, #0055ff 70%)',
//     backgroundSize: '100%',
//     backgroundClip: 'text',
//     WebkitBackgroundClip: 'text',
//     MozBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     MozTextFillColor: 'transparent',
//     border: '1px solid #b583ff',
//     color: '#f53ebb',
//     cursor: 'pointer',
//   },
// };

// const iconStyle = {
//   color: '-webkit-linear-gradient(right, #30ccff 10%, #30ccff, #0055ff 70%)',
//   // backgroundSize: '100%',
//   // backgroundClip: 'text',
//   // WebkitBackgroundClip: 'text',
//   // MozBackgroundClip: 'text',
//   // WebkitTextFillColor: 'transparent',
//   // MozTextFillColor: 'transparent',
//   marginRight: '1rem',
// };

export const CalloutMessage = () => {
  return (
    <Link
      href="https://bit.ly/AI-Art-Attribution-Form"
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
          fontSize: '4rem',
          // color: '#f53ebb',
          // '-webkit-linear-gradient(right, #b583ff 10%, #f53ebb, #b583ff 70%)',
        }}
      >
        <Typography>Are you an Artist? Be featured!</Typography>
        <ArrowRightAltOutlinedIcon sx={{ paddingLeft: '0.5rem' }} />
      </Box>
    </Link>
  );
  // return (
  //   //<Box sx={{ height: (theme) => theme.spacing(10) }} />
  //   <Box onClick={onClick} sx={calloutStyle}>
  //     <Box component="button" sx={contentStyle}>
  //       <PaletteOutlinedIcon sx={iconStyle} />
  //       <Typography>{text}</Typography>
  //       {/* <CloseRoundedIcon
  //         sx={{
  //           position: 'absolute',
  //           right: '1rem',
  //         }}
  //         onClick={() => setCallout(false)}
  //       /> */}
  //     </Box>
  //     {children}
  //   </Box>
  // );
};
