import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import { ArtistData } from '@/context';

// {
//   artist: ArtistData;
//   modalOpen: Boolean;
//   setModalOpen: Dispatch<SetStateAction<boolean>>;
// }

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: '#b583ff', //stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export const ArtistModal = ({
  artist,
  modalOpen,
  setModalOpen, //Dispatch<SetStateAction<boolean>>
}: {
  artist: ArtistData;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="scroll-dialog-title">{artist.name}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="scroll-dialog-description"
          // ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '10%', margin: '0 1rem' }}>
              {Boolean(artist.avatar) ? (
                <Avatar
                  alt={artist.name}
                  src={artist.avatar}
                  sx={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <Avatar
                  {...stringAvatar(artist.name)}
                  sx={{ width: '100%', height: 'auto' }}
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '90%' }}
            >
              <Typography>{artist.name}</Typography>
              <Typography>{artist.period}</Typography>
              <Typography>{artist.nationality}</Typography>
              <Typography>{artist.biography}</Typography>
            </Box>
          </Box>
          <Box>
            {/* <Typography variant="h4" color="white"> */}
            <DialogTitle sx={{ margin: 0, paddingLeft: 0, color: 'white' }}>
              Generated Images Examples
            </DialogTitle>
            {/* </Typography> */}
            <Typography>Prompt:</Typography>
            <div>images here</div>
            <Divider />
            <Typography>Prompt:</Typography>
            <div>images here</div>
            <Divider />
          </Box>
          <Box>
            {/* <Typography variant="h4" color="white"> */}
            <DialogTitle sx={{ margin: 0, paddingLeft: 0, color: 'white' }}>
              Artwork Examples
            </DialogTitle>
            <div>images here</div>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
