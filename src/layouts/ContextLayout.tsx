import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import React from 'react';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from '../pages/HomePage';
import ArtistSignup from '../pages/ArtistSignup';
import { WebHeader } from '@/components';
import { PageLayout } from '@/layouts';
import {
  NavigationContextProvider,
  WalletContextProvider,
  ContractContextProvider,
  StatusContextProvider,
  ImageContextProvider,
  NetworkContextProvider,
  ArtistContextProvider,
} from '@/context';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

//I think my context's maybe shouldn't have children
export const ContextLayout = ({ Component, pageProps }: AppProps) => {
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
                      {/* {router.pathname === '/' && <HomePage />}
                      {router.pathname === '/ArtistSignup' && <ArtistSignup />} */}
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
};
