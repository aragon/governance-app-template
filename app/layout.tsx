import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Web3Modal } from "./context/Web3Modal";
import Header from "./containers/header";
import Sidebar from "./containers/sidebar";
import '@aragon/ods/index.css';
import './globals.css'

const inter = Inter({
  subsets: ['latin']
})

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
      <body className={`${inter.className} bg-white`}>
          <div className="flex h-screen ">
            <Sidebar />
            <div className="overflow-y-auto flex flex-col items-center">
              <div className="w-3/4">
              <Header />
              <Web3Modal>
                {children}
              </Web3Modal>
              </div>
            </div>
        </div>
      </body>
    </html>
  )
}
