import { ReactNode } from "react";

export default function Home() {
  return (
    <main className="w-screen max-w-full flex-col">
      {/* Section 1: Hero Section */}
      <Card>
        <h1 className="text-2xl font-bold">Welcome to Aragonette!</h1>
        <p className="text-lg">
          We provide a DAO experience for you. It&apos;s a template that you can customize.
        </p>
      </Card>

      {/* Section 2: About Us Section */}
      <Card>
        <h2 className="text-2xl font-bold">About Us</h2>
        <p className="text-lg">
          We are a team of professionals dedicated to providing the best
          service.
        </p>
      </Card>

      {/* Section 3: Contact Us Section */}
      <Card>
        <h2 className="text-2xl font-bold">FAQ</h2>
        <p className="text-lg">
          Let us resolve your questions, we know what we are doing.
        </p>
      </Card>
      <Card>
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="text-lg">Get in touch with us for more information.</p>
      </Card>
    </main>
  );
}

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full flex flex-col space-y-6 shadow-lg
    box-border border border-neutral-0
    focus:outline-none focus:ring focus:ring-primary
    px-4 py-5 xs:px-10 md:px-6 lg:px-7 mb-6
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};
