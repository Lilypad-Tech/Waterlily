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
  ArtistContextProvider,
} from '@/context';
import HomePage from './HomePage';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

//I think my context's maybe shouldn't have children
export default function Home() {
  return (
    //Wallet Context Provider here
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StatusContextProvider>
        <NetworkContextProvider>
          <ArtistContextProvider>
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
          </ArtistContextProvider>
        </NetworkContextProvider>
      </StatusContextProvider>
    </ThemeProvider>
  );
}
