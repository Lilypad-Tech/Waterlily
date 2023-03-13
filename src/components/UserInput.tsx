import { FC, ReactElement, useState, useContext } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MyButton } from '@/components';
import { artists, ArtistType, networks } from '@/definitions';
import {
  WalletContext,
  StableDiffusionContext,
  StatusContext,
  defaultWalletState,
  defaultStatusState,
} from '@/context';

// import { appUserInput } from '@/definitions/strings';

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

type UserInputProps = {};

export const UserInput: FC<UserInputProps> = (): ReactElement => {
  const [prompt, setPrompt] = useState('');
  const [artist, setArtist] = useState({ name: '', key: '' });
  const { runStableDiffusionJob } = useContext(StableDiffusionContext);
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  const { verifyChainId, changeWalletChain } = useContext(WalletContext);
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
    });
  };

  const generateImages = async () => {
    console.log('run lilypad function', artist);
    if (verifyChainId(networks.filecoinHyperspace.chainId)) {
      await runStableDiffusionJob(prompt, artist.key); //artist should equal the artistId
    } else {
      changeWalletChain(networks.filecoinHyperspace.chainId);
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

  return (
    <Box sx={containerStyle}>
      <Typography sx={textStyle}>
        Enter a prompt and choose an artist style for our magical machine to
        run... 🦄
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
            placeholder="A rainbow unicorn dancing on an Australian Beach"
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
      <br />
      <MyButton
        name="Generate Images"
        action={generateImages}
        disabled={!prompt || !artist || Boolean(statusState.isLoading)}
      />
    </Box>
  );
};
