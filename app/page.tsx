import Image from 'next/image'

export default function Home() {
  return (
    <main className="w-screen max-w-full flex-col">
      {/* Section 1: Hero Section */}
      <section className="flex flex-col items-center justify-center w-full h-screen max-h-96 bg-neutral-100">
        <h1 className="text-5xl font-bold">Welcome to Aragonette!</h1>
        <p className="text-xl">We provide a DAO experience for you. Not the best, but it kinda works</p>
      </section>

      {/* Section 2: About Us Section */}
      <section className="flex flex-col items-center justify-center w-full h-screen max-h-96 bg-neutral-200">
        <h2 className="text-4xl font-bold">About Us</h2>
        <p className="text-lg">We are a team of professionals dedicated to providing the best service.</p>
      </section>

      {/* Section 3: Contact Us Section */}
      <section className="flex flex-col items-center justify-center w-full h-screen max-h-96 bg-neutral-300">
        <h2 className="text-4xl font-bold">FAQ</h2>
        <p className="text-lg">Let us resolve your questions, we know what we are doing.</p>
      </section>
      <section className="flex flex-col items-center justify-center w-full h-screen max-h-96 bg-neutral-400">
        <h2 className="text-4xl font-bold">Contact Us</h2>
        <p className="text-lg">Get in touch with us for more information.</p>
      </section>

    </main>
  )
}
