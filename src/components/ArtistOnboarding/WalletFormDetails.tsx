// Deals with cases where no wallet is connected or balance <0.11FIL
import { SectionLayout } from '@/layouts';
import { WalletButton } from '..';

//https://docs.filecoin.io/smart-contracts/wallets/metamask/

export const WalletFormDetails = () => {
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
