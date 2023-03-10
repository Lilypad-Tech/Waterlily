import { FC, ReactElement, ReactNode } from 'react';
import { Box, TextField } from '@mui/material';

type PromptInputProps = {
  prompt: string;
  setPrompt: Function;
  // status: Status;
  // action: Function;
};

const promptStyle = {
  width: '100%',
};

export const PromptInput: FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  ...rest
}): ReactElement => {
  return (
    <Box
      component="form"
      sx={{
        display: 'grid',
        rowGap: 3,
      }}
    >
      <TextField
        label="Text Prompt"
        placeholder="A rainbow Bacalhau in the style of a Monet picture dancing on an Australian Beach"
        id="prompt_input"
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ width: '100%', justifySelf: 'center' }}
      />
    </Box>
  );
};
