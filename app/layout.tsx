"use client";

import { ReactNode } from "react";
import Head from "next/head";
import { Manrope } from "next/font/google";
import { RootContextProvider } from "./context";
import Header from "./containers/header";
import Sidebar from "./containers/sidebar";
import "@aragon/ods/index.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <body className={`${manrope.className} bg-primary-50`}>
        <div className="flex h-screen ">
          <RootContextProvider>
            <Sidebar />
            <div className="overflow-y-auto flex flex-col items-center w-full">
              <div className="w-full md:w-3/4 lg:w-2/3 2xl:w-1/2 p-3">
                <Header />
                {children}
              </div>
            </div>
          </RootContextProvider>
        </div>
      </body>
    </html>
  );
}
