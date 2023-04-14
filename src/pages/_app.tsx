// import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React from 'react';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  NavigationContextProvider,
  WalletContextProvider,
  ContractContextProvider,
  StatusContextProvider,
  ImageContextProvider,
  NetworkContextProvider,
  ArtistContextProvider,
} from '@/context';
import { WebHeader } from '@/components';
import { PageLayout } from '@/layouts';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationContextProvider handleNavigation={handleNavigation}>
        <StatusContextProvider>
          <NetworkContextProvider>
            <ArtistContextProvider>
              <WalletContextProvider>
                <ImageContextProvider>
                  <ContractContextProvider>
                    <WebHeader />
                    <PageLayout>
                      <Component {...pageProps} />
                    </PageLayout>
                  </ContractContextProvider>
                </ImageContextProvider>
              </WalletContextProvider>
            </ArtistContextProvider>
          </NetworkContextProvider>
        </StatusContextProvider>
      </NavigationContextProvider>
    </ThemeProvider>
  );
}
