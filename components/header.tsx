import { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@aragon/ods";
import { useAccount } from "wagmi";
import { Else, IfCase, Then } from "./if";
import { formatAddress } from "@/utils/addressHelper";
import { useEffect, useState } from "react";

const Header = () => {
  const [skipRender, setSkipRender] = useState(true);
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [skip, setSkip] = useState(true)

  useEffect(() => setSkip(false), [])

  if(skip) return <></>;

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
            {formatAddress(address as any)}
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
