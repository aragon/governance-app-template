const DEFAULT_MESSAGE =
  "The link you followed refers to a resource that doesn't exist";

export function NotFound({ message }: { message?: string }) {
  return (
    <section className="w-screen max-w-full min-w-full">
      <h3 className="text-3xl pr-4 font-semibold text-neutral-700">
        Not found
      </h3>
      <p>{message ?? DEFAULT_MESSAGE}</p>
    </section>
  );
}
