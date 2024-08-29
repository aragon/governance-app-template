import { type ReactNode } from "react";

export function SectionView({ children }: { children: ReactNode }) {
  return <div className="mb-6 flex w-full flex-row content-center justify-between">{children}</div>;
}
