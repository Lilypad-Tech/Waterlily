// import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
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
import * as gtag from '../lib/gtag';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

const GA = () => {
  return (
    <>
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
                });
        `}
      </Script>
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
  };
  return (
    <ThemeProvider theme={theme}>
      <GA />
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
