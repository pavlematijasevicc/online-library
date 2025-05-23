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
import Layout from "@/components/Layout";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

// ✅ Type extensions to support getLayout
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

// ✅ Load Roboto font
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

// ✅ Emotion cache for SSR
const clientCache = createEmotionCache({ enableCssLayer: true });

export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientCache,
}: AppPropsWithLayout) {
  // ✅ Use getLayout if defined, else use default layout
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

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
          {getLayout(<Component {...pageProps} />)}
        </main>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
