import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@aragon/ods";
import { useAccount } from "wagmi";
import { Else, If, Then } from "@/components/if";
import WalletContainer from "./WalletContainer";

const Header = () => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <div className="mt-5 flex h-14 w-full flex-row-reverse md:h-24">
      <If condition={isConnected}>
        <Then>
          <div>
            <WalletContainer />
          </div>
        </Then>
        <Else>
          <Button size="md" variant="primary" onClick={() => open()}>
            <span>Connect wallet</span>
          </Button>
        </Else>
      </If>
    </div>
  );
};

export default Header;
