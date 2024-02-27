import { ReactNode } from "react";

export default function Home() {
  return (
    <main className="w-screen max-w-full flex-col">
      <Card>
        <h1 className="text-2xl font-[700] text-neutral-800">
          Welcome to Aragonette!
        </h1>
        <p className="text-md text-neutral-400">
          We provide a DAO experience for you in a simple template that you can
          customize.
        </p>
      </Card>
      <Card>
        <div className="grid lg:grid-cols-2 lg:gap-3 lg:text-center">
          <div>
            <h2 className="text-lg font-[600] pb-2 text-primary-900">
              About Us
            </h2>
            <p className="text-sm text-neutral-400">
              We are a team of professionals dedicated to providing the best
              service.
            </p>
          </div>

          <div className="mt-4 lg:mt-0">
            <h2 className="text-lg font-[600] pb-2 text-primary-900">FAQ</h2>
            <p className="text-sm text-neutral-400">
              Let us resolve your questions, we know what we are doing.
            </p>
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
      className="w-full flex flex-col space-y-6 drop-shadow-sm
    box-border border border-neutral-0
    focus:outline-none focus:ring focus:ring-primary
    px-4 py-5 xs:px-10 md:px-6 lg:px-7 mb-6
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};
