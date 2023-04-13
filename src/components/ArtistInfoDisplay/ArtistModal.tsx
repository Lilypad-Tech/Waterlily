import { Dispatch, SetStateAction, useState } from 'react';
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
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Close,
  ContentCopyOutlined,
  OpenInNewOutlined,
} from '@mui/icons-material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ArtistData } from '@/context';
import { LinkTo } from '@/components';

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

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
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {artist.name}
        <IconButton aria-label="close" onClick={() => setModalOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          overflowX: 'hidden',
          whitespace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      >
        <DialogContentText
          id="scroll-dialog-description"
          // ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: '1rem',
            }}
          >
            <Box
              sx={{
                width: '10%',
                margin: '0 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
              }}
            >
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
              <LinkTo
                text="Portfolio"
                href={artist.portfolio}
                icon={<OpenInNewOutlined sx={{ height: '18px' }} />}
              />
              <Typography>{artist.period}</Typography>
              <Typography>{artist.nationality}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
                paddingLeft: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <Typography gutterBottom>{artist.category}</Typography>
              <Box display="flex" flexWrap="wrap" paddingBottom="1rem">
                {artist.tags.length > 0 &&
                  artist.tags.map((tag) => {
                    if (tag === '') return;
                    return (
                      <Box mr={1} mb={0.5} key={tag}>
                        <Chip
                          label={tag}
                          variant="outlined"
                          size="small"
                          color="primary"
                        />
                      </Box>
                    );
                  })}
              </Box>
              <Typography
                gutterBottom
                variant="body1"
                sx={{ flexWrap: 'wrap', overflowWrap: 'break-word' }}
              >
                {artist.biography}
              </Typography>
              <CopyToClipboard text={artist.walletAddress} onCopy={handleCopy}>
                <Typography
                  // variant={props.variant}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: '2rem',
                    color: 'white',
                  }}
                  // color={copied ? 'success' : 'text.primary'}
                >
                  <Typography sx={{ paddingRight: '8px' }}>
                    Donation Address:{' '}
                  </Typography>
                  <Typography
                    color="primary"
                    sx={{ overflowWrap: 'break-word' }}
                  >
                    {artist.walletAddress}
                  </Typography>
                  <ContentCopyOutlined
                    sx={{ margin: '0 8px', padding: '2px' }}
                  />
                  {copied && 'Copied!'}
                </Typography>
              </CopyToClipboard>
            </Box>
          </Box>
          <Box sx={{ paddingTop: '1rem' }}>
            {/* <Typography variant="h4" color="white"> */}
            <DialogTitle sx={{ margin: 0, paddingLeft: 0, color: 'white' }}>
              Generated Image Examples
            </DialogTitle>
            {/* </Typography> */}
            <Typography variant="subtitle1">Prompt: Prompt 1</Typography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              {artist.thumbnails.map((thumb, i) => {
                if (i > 3) return;
                return (
                  <Grid
                    item
                    xs="auto" //{12}
                    sm="auto" //{6}
                    md="auto" //{3}
                    lg="auto" //{3}
                    xl="auto" //{3}
                    component="img"
                    key={thumb.link}
                    // height={210}
                    src={thumb.link || './monet-water-lilies.jpeg'}
                    alt={thumb.alt || 'Monet Water Lilies'}
                    // sx={{
                    //   width: '100%',
                    //   aspectRatio: '3/3',
                    // }}
                    style={{ objectFit: 'cover', maxHeight: '200px' }}
                  />
                );
              })}
            </Grid>
            <Divider sx={{ paddingTop: '1rem' }} />
            <Typography variant="subtitle1" sx={{ margin: '2rem 0 0 0' }}>
              Prompt: Prompt 2
            </Typography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              {artist.thumbnails.map((thumb, i) => {
                if (i > 3) return;
                return (
                  <Grid
                    item
                    xs="auto" //{12}
                    sm="auto" //{6}
                    md="auto" //{3}
                    lg="auto" //{3}
                    xl="auto" //{3}
                    component="img"
                    key={thumb.link}
                    // height={210}
                    src={thumb.link || './monet-water-lilies.jpeg'}
                    alt={thumb.alt || 'Monet Water Lilies'}
                    // sx={{
                    //   width: '100%',
                    //   aspectRatio: '3/3',
                    // }}
                    style={{ objectFit: 'cover', maxHeight: '200px' }}
                  />
                );
              })}
            </Grid>
            <Divider sx={{ paddingTop: '1rem' }} />
          </Box>
          <Box sx={{ paddingTop: '1rem' }}>
            {/* <Typography variant="h4" color="white"> */}
            <DialogTitle sx={{ margin: 0, paddingLeft: 0, color: 'white' }}>
              Artwork Examples
            </DialogTitle>
            {/* Consider using autolayout here https://mui.com/material-ui/react-grid/ */}
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              {artist.thumbnails.map((thumb) => {
                return (
                  <Grid
                    item
                    xs="auto" //{12}
                    sm="auto" //{6}
                    md="auto" //{4}
                    lg="auto" //{4}
                    xl="auto" //{4}
                    component="img"
                    key={thumb.link}
                    src={thumb.link || './monet-water-lilies.jpeg'}
                    alt={thumb.alt || 'Monet Water Lilies'}
                    sx={
                      {
                        // width: '100%',
                        // aspectRatio: '3/2',
                      }
                    }
                    style={{ objectFit: 'scale-down', maxHeight: '270px' }}
                  />
                );
              })}
            </Grid>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
