import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Web3Modal } from "./context/Web3Modal";
import Header from "./containers/header";

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aragonette UI',
  description: 'Simplified Aragon Interface for quick prototyping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} className="bg-primary-500">
        <Web3Modal>
          <Header/>
          <main>{children}</main>
        </Web3Modal>
      </body>
    </html>
  )
}
