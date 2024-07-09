export function SplitRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between">
      <p>{left}</p>
      <p>{right}</p>
    </div>
  );
}
