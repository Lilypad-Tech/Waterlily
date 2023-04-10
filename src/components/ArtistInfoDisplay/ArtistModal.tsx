import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { ArtistData } from '@/context';

// {
//   artist: ArtistData;
//   modalOpen: Boolean;
//   setModalOpen: Dispatch<SetStateAction<boolean>>;
// }

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
          {[...new Array(50)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
            )
            .join('\n')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
