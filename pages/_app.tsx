import { RootContextProvider } from "@/context";
import { Layout } from "@/components/layout";
import { Manrope } from "next/font/google";
import "@aragon/ods/index.css";
import "@/pages/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function AragonetteApp({ Component, pageProps }: any) {
  return (
    <div className={manrope.className}>
      <RootContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RootContextProvider>
    </div>
  );
}
