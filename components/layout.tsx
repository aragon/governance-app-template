import { type ReactNode } from "react";
import { Navbar } from "./nav/navbar";

export const Layout: React.FC<{ children: ReactNode }> = (props) => {
  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex w-full flex-col items-center">
        <Navbar />
        <div className="flex w-full flex-col items-center px-4 py-6 md:w-4/5 md:p-6 lg:w-2/3 xl:py-10 2xl:w-3/5">
          {props.children}
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};
