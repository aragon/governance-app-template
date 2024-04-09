import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { type ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex w-full flex-col items-center overflow-y-auto">
        <div className="w-full p-3 md:w-4/5 lg:w-2/3 2xl:w-3/5">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
