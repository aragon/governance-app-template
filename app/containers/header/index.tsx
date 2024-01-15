"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@aragon/ods";

const Header = () => {
  const { open } = useWeb3Modal();
  return (
    <div className="flex flex-row-reverse w-full mt-5 h-24">
      <Button size="md" variant="primary" onClick={() => open()}>
        Connect wallet
      </Button>
    </div>
  );
};

export default Header;
