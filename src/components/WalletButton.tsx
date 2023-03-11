import { FC, useContext, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { WalletContext } from '@/context';

interface buttonStateType {
  name: string;
  action: () => {};
  background: string;
}
const style = {
  backgroundSize: '200% 200%',
  animation: `gradient-animation 4s ease infinite`,
  color: 'white',
  fontWeight: 'bold',
  fontSize: 'larger',
  paddingTop: '0.5em',
  paddingRight: '1.5em',
  paddingLeft: '1.5em',
};

export const WalletButton: FC = () => {
  const buttonStates: any = {
    connectState: {
      name: 'Connect',
      action: () => connectWallet(),
      background: `-webkit-linear-gradient(left, #f53ebb 10%, #b583ff 70%);`,
    },
    connectedState: {
      name: 'Connected',
      action: () => disconnectWallet(),
      background: `-webkit-linear-gradient(left, #30ccff 10%, #0055ff 70%);`,
    },
    installWalletState: {
      name: 'Install Metamask! 🦊',
      action: () =>
        window.open(
          'https://metamask.io/download.html',
          '_blank',
          'noreferrer'
        ),
      background: `-webkit-linear-gradient(left, #f8a929 10%, #f38218 70%);`,
    },
  };
  const { walletState, connectWallet, disconnectWallet } =
    useContext(WalletContext);
  // const [buttonState, setButtonState] = useState<buttonStateType>(
  //   buttonStates.connect
  // );

  const buttonState = !walletState?.web3
    ? buttonStates.installWalletState
    : walletState?.isConnected
    ? buttonStates.connectedState
    : buttonStates.connectState;

  // useEffect(() => {
  //   console.log('button', walletState);
  //   if (!walletState?.web3) {
  //     setButtonState(buttonStates.installWalletState);
  //   } else if (walletState?.isConnected) {
  //     setButtonState(buttonStates.connectedState);
  //   } else {
  //     setButtonState(buttonStates.connectState);
  //   }
  // }, [walletState]);

  return (
    <Button
      variant="contained"
      onClick={buttonState?.action}
      sx={{ ...style, background: `${buttonState?.background}` }}
    >
      {buttonState?.name}
    </Button>
  );
};
