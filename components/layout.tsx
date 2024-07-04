import { type ReactNode } from "react";
import { Navbar } from "./nav/navbar";

export const Layout: React.FC<{ children: ReactNode }> = (props) => {
  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex w-full flex-col items-center">
        <Navbar />
        <div className="flex w-full flex-col items-center">{props.children}</div>
      </div>

      {/* Footer */}
    </div>
  );
};
