import { RootContextProvider } from "@/context";
import { Layout } from "@/components/layout";
import { Manrope } from "next/font/google";
import "@aragon/ods/index.css";
import "@/pages/globals.css";
import { APP_PAGE_TITLE } from "@/constants";
import Head from "next/head";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function AragonetteApp({ Component, pageProps }: any) {
  // const initialState = cookieToInitialState(config, headers().get('cookie'))

  return (
    <div className={manrope.className}>
      <Head>
        <title>{APP_PAGE_TITLE}</title>
      </Head>
      <RootContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RootContextProvider>
    </div>
  );
}
