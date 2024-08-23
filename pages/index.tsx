import { MainSection } from "@/components/layout/main-section";
import { Button, IllustrationHuman } from "@aragon/ods";
import { type ReactNode } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Else, If, Then } from "@/components/if";
import { PUB_APP_NAME } from "@/constants";

export default function StandardHome() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <MainSection narrow>
      <Card>
        <h1 className="line-clamp-1 flex flex-1 shrink-0 text-2xl font-normal leading-tight text-neutral-800 md:text-3xl">
          Welcome to {PUB_APP_NAME}
        </h1>
        <p className="text-md text-neutral-400">
          A beaufitul DAO experience in a simple template that you can customize. Get started by connecting your wallet
          and selecting a plugin from the menu.
        </p>
        <div className="">
          <IllustrationHuman className="mx-auto mb-10 max-w-96" body="BLOCKS" expression="SMILE_WINK" hairs="CURLY" />
          <div className="flex justify-center">
            <If true={isConnected}>
              <Then>
                <Button className="mb-2" variant="primary" href="https://devs.aragon.org/" target="_blank">
                  Learn more about OSx
                </Button>
              </Then>
              <Else>
                <Button size="md" variant="primary" onClick={() => open()}>
                  <span>Connect wallet</span>
                </Button>
              </Else>
            </If>
          </div>
        </div>
      </Card>
    </MainSection>
  );
}

// This should be encapsulated
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="xs:px-10 mb-6 box-border flex
    w-full flex-col space-y-6
    rounded-xl border border-neutral-100
    bg-neutral-0 px-4 py-5 focus:outline-none focus:ring focus:ring-primary
    md:px-6 lg:px-7"
    >
      {children}
    </div>
  );
};
