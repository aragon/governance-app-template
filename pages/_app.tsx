import { RootContextProvider } from "@/context";
import { Layout } from "@/components/layout";
import AlertContainer from "@/components/alert/alert-container";
import { Manrope } from "next/font/google";
import "@aragon/ods/index.css";
import "@/pages/globals.css";
import { PUB_APP_NAME } from "@/constants";
import Head from "next/head";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function AragonetteApp({ Component, pageProps }: any) {
  return (
    <div className={manrope.className}>
      <Head>
        <title>{PUB_APP_NAME}</title>
      </Head>
      <RootContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <AlertContainer />
      </RootContextProvider>
    </div>
  );
}
