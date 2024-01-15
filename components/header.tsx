import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@aragon/ods";
import { useAccount, useWalletClient } from "wagmi";
import { Else, IfCase, Then } from "./if";

const Header = () => {
  const { isConnected } = useAccount();
  const { data: client } = useWalletClient();
  const { open } = useWeb3Modal();

  return (
    <div className="flex flex-row-reverse w-full mt-5 h-24">
      <IfCase condition={isConnected}>
        <Then>
          <Button suppressHydrationWarning size="md" variant="secondary" onClick={() => open()}>
            <span suppressHydrationWarning>
              Connected {client?.chain?.name ? "to " + client?.chain?.name : ""}
            </span>
          </Button>
        </Then>
        <Else>
          <Button suppressHydrationWarning size="md" variant="primary" onClick={() => open()}>
            <span suppressHydrationWarning>Connect wallet</span>
          </Button>
        </Else>
      </IfCase>
    </div>
  );
};

export default Header;
