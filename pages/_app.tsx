import { RootContextProvider } from "../context";
import { Layout } from "@/components/layout";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Manrope } from "next/font/google";
import "@aragon/ods/index.css";
import "./globals.css";

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
