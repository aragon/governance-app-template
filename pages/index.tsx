import { Button, IllustrationHuman } from "@aragon/ods";
import { type ReactNode } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Else, If, Then } from "@/components/if";

export default function Home() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <main className="w-screen max-w-full flex-col">
      <Card>
        <h1 className="text-2xl font-[700] text-neutral-800">Welcome to Aragonette!</h1>
        <p className="text-md text-neutral-400">
          A beaufitul DAO experience in a simple template that you can customize. Get started by connecting your wallet
          and selecting a plugin from the menu.
        </p>
        <div className="">
          <IllustrationHuman className="mx-auto mb-10 max-w-96" body="BLOCKS" expression="SMILE_WINK" hairs="CURLY" />
          <div className="flex justify-center">
            <If condition={isConnected}>
              <Then>
                <Button className="mb-2" variant="primary" href="https://devs.aragon.org/docs/osx/" target="_blank">
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
    </main>
  );
}

// This should be encapsulated as soon as ODS exports this widget
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
