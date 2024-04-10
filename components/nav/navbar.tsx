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
    { path: "/", id: "dashboard", name: "Dashboard", icon: IconType.APP_DASHBOARD },
    ...plugins.map((p) => ({
      id: p.id,
      name: p.title,
      path: `/plugins/${p.id}/#/`,
      icon: p.icon,
    })),
  ];

  return (
    <>
      <nav className="h-30 sticky top-0 w-full flex-col gap-2 border-b border-b-neutral-100 bg-neutral-0 p-3 md:px-6 md:pb-0 md:pt-5 lg:gap-3">
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className={classNames(
              "flex items-center gap-x-3 rounded-full md:rounded-lg",
              "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
            )}
          >
            <Image src="/logo-bw-lg.png" width="36" height="36" className="shrink-0" alt="Aragonette" />
            <span className="hidden py-1 text-lg font-semibold leading-tight text-neutral-700 sm:block md:text-xl">
              Aragonette
            </span>
          </Link>

          <div className="flex items-center gap-x-2">
            <div className="shrink-0">
              <WalletContainer />
            </div>

            {/* Nav Trigger */}
            <button
              onClick={() => setOpen(true)}
              className={classNames(
                "rounded-full border border-neutral-100 bg-neutral-0 p-1 md:hidden",
                "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
              )}
            >
              <AvatarIcon size="lg" icon={IconType.MENU} />
            </button>
          </div>
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
