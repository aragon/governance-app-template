import { type ReactNode } from "react";
import { Navbar } from "./nav/navbar";
import Image from "next/image";

export const Layout: React.FC<{ children: ReactNode }> = (props) => {
  return (
    <div className="flex flex-col items-center gap-20 bg-[#000]">
      <div className="flex w-full flex-col items-center">
        <Image
          src="/images/1920bg1.png"
          alt="vote ringdao"
          width={1000}
          height={1000}
          className="absolute right-0 h-[100vh] w-[100vw] object-contain object-right-top"
        />
        <Image
          src="/images/1920bg2.png"
          alt="vote ringdao"
          width={1000}
          height={1000}
          className="absolute left-0 right-0 top-0 h-[100vh] w-[100vw] object-contain object-left-top"
        />
        <Navbar />
        <div className="relative z-10 flex w-full justify-center">
          <span className="absolute left-0 top-0 block h-[20px] w-[20px] bg-[#fff]" />
          <div className="flex w-full flex-col items-center px-4 py-6 md:w-4/5 md:p-6 lg:w-2/3 xl:py-10 2xl:w-3/5">
            {props.children}
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};
