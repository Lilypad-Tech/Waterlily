// Deals with cases where no wallet is connected or balance <0.11FIL
import { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { SectionLayout } from '@/layouts';
import { WalletButton } from '..';
import {
  WalletContext,
  defaultWalletState,
  StatusContext,
  statusState,
  defaultStatusState,
} from '@/context';
const MIN_FUNDS = 0.1;
//https://docs.filecoin.io/smart-contracts/wallets/metamask/

export const WalletFormDetails = () => {
  const { walletState = defaultWalletState.walletState, fetchWalletBalance } =
    useContext(WalletContext);
  const { statusState = defaultStatusState } = useContext(StatusContext);

  return (
    //
    <SectionLayout>
      {/* {walletState.web3 ? (
        <Box>Why do I need a wallet to connect? Answers</Box>
      ) : walletState.balance < MIN_FUNDS ? (
        <Box>You Don't have enough funds to pay gas</Box>
      ) : (
        <Box> Where do I get a wallet? etc.</Box>
      )} */}

      {/* We know here that isConnected is false or accounts[0] is empty.
        1.  
      
      */}
      <WalletButton />
    </SectionLayout>
  );
};
