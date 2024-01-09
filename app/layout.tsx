import { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { RootContextProvider } from "./context";
import Header from "./containers/header";
import Sidebar from "./containers/sidebar";
import "@aragon/ods/index.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aragonette",
  description: "Simplified Aragon Interface for quick prototyping",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} bg-white`}>
        <div className="flex h-screen ">
          <Sidebar />
          <div className="overflow-y-auto flex flex-col items-center w-full">
            <div className="w-3/4">
              <Header />
              <RootContextProvider>{children}</RootContextProvider>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
