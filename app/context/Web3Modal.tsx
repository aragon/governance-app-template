"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { sepolia, mainnet } from 'viem/chains'

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

// 2. Create wagmiConfig
const metadata = {
  name: 'Aragonette',
  description: 'Simplified UI for Aragon',
  url: 'https://aragon.org',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
console.log("Project Id: ", projectId);
createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
