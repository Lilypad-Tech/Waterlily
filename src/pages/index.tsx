import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styles from '@/styles/Home.module.css';
import { Header } from '@/components';

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

//Wallet auth belongs here too?
export default function Home() {
  const [wallet, setWallet] = useState({}); //create a hook for this
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main className={styles.main}>
        <div className={styles.description}>Take me home</div>
      </main>
    </ThemeProvider>
  );
}
