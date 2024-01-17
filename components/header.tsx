import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@aragon/ods";
import { useAccount, useWalletClient } from "wagmi";
import { Else, IfCase, Then } from "./if";
import { formatHexString } from "@/utils/evm";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { data: client } = useWalletClient();
  const { open } = useWeb3Modal();

  return (
    <div className="flex flex-row-reverse w-full mt-5 h-24">
      <IfCase condition={isConnected}>
        <Then>
          <span
            suppressHydrationWarning
            onClick={() => open()}
            className="text-primary-500 underline cursor-pointer"
          >
            {formatHexString(address as any)}
          </span>
        </Then>
        <Else>
          <Button
            suppressHydrationWarning
            size="md"
            variant="primary"
            onClick={() => open()}
          >
            <span suppressHydrationWarning>Connect wallet</span>
          </Button>
        </Else>
      </IfCase>
    </div>
  );
};

export default Header;
