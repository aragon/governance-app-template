import { ReactNode } from "react";

export default function Home() {
  return (
    <main className="w-screen max-w-full flex-col">
      {/* Section 1: Hero Section */}
      <Section>
        <h1 className="text-4xl font-bold">Welcome to Aragonette!</h1>
        <p className="text-xl">
          We provide a DAO experience for you. Not the best, but it kinda works
        </p>
      </Section>

      {/* Section 2: About Us Section */}
      <Section>
        <h2 className="text-3xl font-bold">About Us</h2>
        <p className="text-lg">
          We are a team of professionals dedicated to providing the best
          service.
        </p>
      </Section>

      {/* Section 3: Contact Us Section */}
      <Section>
        <h2 className="text-3xl font-bold">FAQ</h2>
        <p className="text-lg">
          Let us resolve your questions, we know what we are doing.
        </p>
      </Section>
      <Section>
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="text-lg">Get in touch with us for more information.</p>
      </Section>
    </main>
  );
}

const Section = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex flex-col items-left justify-center w-full mb-8 max-h-96">
      {children}
    </section>
  );
};
