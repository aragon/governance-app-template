'use client'

import { useAccount } from "wagmi";
import MyComponent from "@/components/landing";


export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="w-screen max-w-full flex-col">
      <MyComponent connected={isConnected} />
    </div>
  );
}

