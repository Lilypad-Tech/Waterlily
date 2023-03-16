import { FC, ReactElement, useState, useContext, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Link,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MyButton } from '@/components';
import { artists, ArtistType, networks } from '@/definitions';
import {
  NetworkContext,
  WalletContext,
  ContractContext,
  StatusContext,
  defaultStatusState,
  ImageContext,
} from '@/context';

const MIN_BALANCE = 0.15;

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
};

const userInputStyle = {
  padding: '0.5rem 0 0.5rem 0',
  height: '5rem',
  width: '80%',
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const textStyle = {
  // fontFamily: 'fantasy',
};

type UserInputProps = {
  initialPrompt?: string;
  initialArtist?: {
    name: string;
    key: string;
    style: string;
  };
};

export const UserInput: FC<UserInputProps> = ({
  initialPrompt = '',
  initialArtist = { name: '', key: '', style: '' },
} = {}): ReactElement => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [artist, setArtist] = useState(initialArtist);
  // const [artist, setArtist, prompt, setPrompt] = useContext(ImageContext);
  const { network } = useContext(NetworkContext);
  const { runStableDiffusionJob } = useContext(ContractContext);
  const {
    statusState = defaultStatusState.statusState,
    setStatusState,
    setSnackbar,
  } = useContext(StatusContext);
  const {
    walletState,
    verifyChainId,
    changeWalletChain,
    checkBalance,
    addNetwork,
  } = useContext(WalletContext);
  const { setImagePrompt, setImageArtist, resetAllImageContext } =
    useContext(ImageContext);
  const artistObj = artists.reduce<Record<string, ArtistType>>(
    (acc, artist) => {
      acc[artist.name] = artist;
      return acc;
    },
    {}
  );

  const handleChange = (event: SelectChangeEvent) => {
    setArtist({
      name: event.target.value as string,
      key: artistObj[event.target.value].artistId,
      style: artistObj[event.target.value].style,
    });
  };

  const generateImages = async () => {
    console.log('run lilypad function', artist);
    setStatusState({
      ...defaultStatusState.statusState,
      isLoading: 'Submitting Waterlily job to the FVM network ...',
    });
    if (verifyChainId(network.chainId)) {
      let balance = await checkBalance();
      if (!balance || balance < MIN_BALANCE) {
        setSnackbar({
          open: true,
          type: 'warning',
          message: "Sorry, you don't have enough $FIL for this transaction :(",
        });
        return;
      }
      resetAllImageContext();
      setImageArtist(artist);
      setImagePrompt(prompt);
      await runStableDiffusionJob(prompt, artist.key); //artist should equal the artistId
    } else {
      setStatusState({
        ...defaultStatusState.statusState,
        isLoading: '',
      });
      changeWalletChain(network.chainId);
    }
  };

  const menuItems = () => {
    return artists.map((artist, el) => {
      return (
        <MenuItem key={artist.name} value={artist.name}>
          {artist.name}
        </MenuItem>
      );
    });
  };

  useEffect(() => {
    setArtist(initialArtist);
  }, [initialArtist]);

  const addFilNetwork = async () => {
    console.log('adding network', network);
    await addNetwork(network);
  };

  return (
    <Box sx={containerStyle}>
      <Typography sx={textStyle}>
        Enter a prompt and choose an artist style to generate images...
      </Typography>
      <Grid container sx={userInputStyle}>
        <Grid
          item
          xs={8}
          sx={{
            paddingRight: '0.5rem',
            ...itemStyle,
          }}
        >
          <TextField
            label="Text Prompt"
            placeholder="A rainbow unicorn in space"
            id="prompt_input"
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            value={prompt}
            sx={{ WebkitBoxShadow: 'none' }}
          />
        </Grid>
        <Grid item xs={4} sx={{ paddingLeft: '0.5rem', ...itemStyle }}>
          <FormControl fullWidth>
            <InputLabel id="artist-select-label">Artist</InputLabel>
            <Select
              labelId="artist-select-label"
              id="artist-select"
              value={artist.name}
              label="Artist"
              onChange={handleChange}
            >
              {menuItems()}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {walletState?.chainId === network.chainId ? null : (
        <Box onClick={addFilNetwork} sx={{ cursor: 'pointer' }}>
          <Link>
            This app runs on the FVM Network {'->'} Click to add network
          </Link>
        </Box>
      )}
      <br />
      <MyButton
        name="Generate Images" //"Coming Soon" //
        action={generateImages}
        disabled={!prompt || !artist.key || Boolean(statusState.isLoading)}
      />
    </Box>
  );
};
