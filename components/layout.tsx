import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="overflow-y-auto flex flex-col items-center w-full">
        <div className="w-full md:w-4/5 lg:w-2/3 2xl:w-3/5 p-3">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
