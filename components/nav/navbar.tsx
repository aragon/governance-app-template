import WalletContainer from "@/components/WalletContainer";
import { plugins } from "@/plugins";
import { AvatarIcon, IconType } from "@aragon/ods";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MobileNavDialog } from "./mobileNavDialog";
import { NavLink, type INavLink } from "./navLink";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navLinks: INavLink[] = [
    // { path: "/", id: "dashboard", name: "Dashboard", icon: IconType.APP_DASHBOARD },
    ...plugins.map((p) => ({
      id: p.id,
      name: p.title,
      path: `/plugins/${p.id}/#/`,
      icon: p.icon,
    })),
  ];

  return (
    <>
      <nav className="h-30 sticky top-0 w-full flex-col gap-2 border-b border-b-neutral-100 p-3 md:px-6 md:pb-0 md:pt-5 lg:gap-3">
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className={classNames(
              "flex items-center gap-x-3 rounded-full md:rounded-lg",
              "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
            )}
          >
            <Image src="/images/logo-icon.png" width="36" height="36" className="shrink-0" alt="Ring Dao" />
            <Image src="/images/logo.png" width="100" height="36" className="shrink-0" alt="Ring Dao" />

            {/* <span className="hidden py-1 text-lg font-semibold leading-tight text-[#fff] sm:block md:text-xl">
              Aragonette
            </span> */}
          </Link>
        </div>

        {/* Tab wrapper */}
        <ul className="hidden gap-x-10 md:flex lg:pl-14">
          {navLinks.map(({ id, name, path }) => (
            <NavLink name={name} path={path} id={id} key={id} />
          ))}
        </ul>
      </nav>
      <MobileNavDialog open={open} navLinks={navLinks} onOpenChange={setOpen} />
    </>
  );
};
