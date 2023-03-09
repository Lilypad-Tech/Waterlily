import { FC } from 'react';
import { Button } from '@mui/material';
import { buttonStrings } from '@/definitions/strings';

interface Props {
  action: Function;
  name: string;
  background: string;
  disabled?: boolean;
}

//change based on name given
const styles = {
  disabled: `-webkit-linear-gradient(left, #858585 10%, #2a2a2a 70%);`,
  connected: `-webkit-linear-gradient(left, #30ccff 10%, #0055ff 70%);`,
  connect: `-webkit-linear-gradient(left, #f53ebb 10%, #b583ff 70%);`,
  installMM: `-webkit-linear-gradient(left, #f8a929 10%, #f38218 70%);`,
};

export const MyButton: FC<Props> = ({ action, name, background, disabled }) => {
  return (
    <Button
      variant="contained"
      sx={{
        background: `${
          disabled
            ? styles.disabled
            : `${styles[background as keyof typeof styles]}`
        }`,
        backgroundSize: '200% 200%',
        animation: `gradient-animation 4s ease infinite`,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'larger',
        // paddingTop: '0.5em',
        // paddingRight: '1.5em',
        // paddingLeft: '1.5em',
      }}
      disabled={disabled}
      onClick={() => action()}
    >
      {name}
    </Button>
  );
};
