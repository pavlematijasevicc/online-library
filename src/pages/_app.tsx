import {
  AppCacheProvider,
  createEmotionCache,
} from "@mui/material-nextjs/v15-pagesRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProps } from "next/app";
import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import "@/globals.css";
import { EmotionCache } from "@emotion/cache";
import theme from "./theme";

// Load Roboto font
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

// Create emotion cache for SSR
const clientCache = createEmotionCache({ enableCssLayer: true });

// Extend AppProps with emotionCache
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientCache,
}: MyAppProps) {
  return (
    <AppCacheProvider emotionCache={emotionCache}>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>My Next.js MUI App</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className={roboto.variable}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
