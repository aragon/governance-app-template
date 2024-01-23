import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@aragon/ods";
import { Address, useAccount } from "wagmi";
import { Else, IfCase, Then } from "./if";
import { formatHexString } from "@/utils/evm";
import { useEffect, useState } from "react";

const Header = () => {
  const [skipRender, setSkipRender] = useState(true);
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  useEffect(() => setSkipRender(false), []);

  if (skipRender) return <></>;

  return (
    <div className="flex flex-row-reverse w-full mt-5 h-24">
      <IfCase condition={isConnected}>
        <Then>
          <span
            onClick={() => open()}
            className="text-primary-500 underline cursor-pointer"
          >
            {formatHexString(address as Address)}
          </span>
        </Then>
        <Else>
          <Button size="md" variant="primary" onClick={() => open()}>
            <span>Connect wallet</span>
          </Button>
        </Else>
      </IfCase>
    </div>
  );
};

export default Header;
