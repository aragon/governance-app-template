import { type ReactNode } from "react";
import { Navbar } from "./nav/navbar";
import { Footer } from "./footer";

export const Layout: React.FC<{ children: ReactNode }> = (props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between gap-20">
      <div className="flex w-full flex-col items-center">
        <Navbar />
        <div className="w-full">{props.children}</div>
      </div>
      <Footer />
    </div>
  );
};
