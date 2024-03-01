import { Button, IllustrationHuman } from "@aragon/ods";
import { ReactNode } from "react";

export default function Home() {
  return (
    <main className="w-screen max-w-full flex-col">
      <Card>
        <h1 className="text-2xl font-[700] text-neutral-800">
          Welcome to Aragonette!
        </h1>
        <p className="text-md text-neutral-400">
          A beaufitul DAO experience in a simple template that you can
          customize. Get started by connecting your wallet and selecting a
          plugin from the menu.
        </p>
        <div className="">
          <IllustrationHuman
            className="max-w-96 mx-auto mb-10"
            body="BLOCKS"
            expression="SMILE_WINK"
            hairs="CURLY"
          />
          <div className="flex justify-center">
            <Button
              className="mb-2"
              variant="primary"
              href="https://devs.aragon.org/docs/osx/"
              target="_blank"
            >
              Learn more about OSx
            </Button>
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
      className="w-full flex flex-col space-y-6
    box-border border border-neutral-100
    focus:outline-none focus:ring focus:ring-primary
    px-4 py-5 xs:px-10 md:px-6 lg:px-7 mb-6
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};
