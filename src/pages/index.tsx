import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WebHeader } from '@/components';
import { PageLayout } from '@/layouts';
import HomePage from './HomePage';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.MuiInputBase': {
            '-webkit-box-shadow': '0 0 0 100px #26679800 inset',
          },
        },
      },
    },
  },
});
theme = responsiveFontSizes(theme);

//Wallet auth belongs here too?
export default function Home() {
  return (
    //Wallet Context Provider here
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebHeader />
      <PageLayout>
        <HomePage />
        {/* <main className={styles.main}>
        <div className={styles.description}>Take me home</div>
      </main> */}
      </PageLayout>
    </ThemeProvider>
  );
}
