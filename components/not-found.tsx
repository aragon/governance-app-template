const DEFAULT_MESSAGE = "The link you followed refers to a resource that doesn't exist";

export function NotFound({ message }: { message?: string }) {
  return (
    <section className="w-screen min-w-full max-w-full">
      <h3 className="pr-4 text-3xl font-semibold text-neutral-700">Not found</h3>
      <p>{message ?? DEFAULT_MESSAGE}</p>
    </section>
  );
}
