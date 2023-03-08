import { FC } from 'react';
import { Button } from '@mui/material';

interface Props {
  type: string;
  action: Function;
  name: string;
  background: string;
  disabled: boolean;
}

//change based on name given
const style = {};

export const MyButton: FC<Props> = ({ action, name, background, disabled }) => {
  return (
    <Button
      variant="contained"
      sx={{
        background: `${background}`,
        backgroundSize: '200% 200%',
        animation: `gradient-animation 4s ease infinite`,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'larger',
        paddingTop: '0.5em',
        paddingRight: '1.5em',
        paddingLeft: '1.5em',
      }}
      disabled={disabled}
      onClick={() => action}
    >
      {name}
    </Button>
  );
};
