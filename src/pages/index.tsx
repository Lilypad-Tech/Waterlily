import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WebHeader } from '@/components';
import { PageLayout } from '@/layouts';
import {
  WalletContextProvider,
  ContractContextProvider,
  StatusContextProvider,
  ImageContextProvider,
  NetworkContextProvider,
} from '@/context';
import HomePage from './HomePage';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

//Wallet auth belongs here too?
export default function Home() {
  return (
    //Wallet Context Provider here
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StatusContextProvider>
        <NetworkContextProvider>
          <WalletContextProvider>
            <ImageContextProvider>
              <ContractContextProvider>
                <WebHeader />
                <PageLayout>
                  <HomePage />
                </PageLayout>
              </ContractContextProvider>
            </ImageContextProvider>
          </WalletContextProvider>
        </NetworkContextProvider>
      </StatusContextProvider>
    </ThemeProvider>
  );
}
