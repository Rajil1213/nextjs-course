import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Layout from "@/components/layout/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
