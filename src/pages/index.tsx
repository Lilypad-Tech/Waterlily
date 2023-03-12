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
  StableDiffusionContextProvider,
  StatusContextProvider,
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
      <WalletContextProvider>
        <StatusContextProvider>
          <WebHeader />
          <PageLayout>
            <StableDiffusionContextProvider>
              <HomePage />
            </StableDiffusionContextProvider>
            {/* <main className={styles.main}>
        <div className={styles.description}>Take me home</div>
      </main> */}
          </PageLayout>
        </StatusContextProvider>
      </WalletContextProvider>
    </ThemeProvider>
  );
}
