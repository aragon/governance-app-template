import WalletContainer from "@/components/WalletContainer";
import { plugins } from "@/plugins";
import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { MobileNavDialog } from "./mobileNavDialog";
import { NavLink, type INavLink } from "./navLink";
import { AvatarIcon, IconType } from "@aragon/ods";
import { PUB_APP_NAME, PUB_PROJECT_LOGO } from "@/constants";

export const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navLinks: INavLink[] = [
    { path: "/", id: "dashboard", name: "Dashboard" /*, icon: IconType.APP_DASHBOARD*/ },
    ...plugins.map((p) => ({
      id: p.id,
      name: p.title,
      path: `/plugins/${p.id}/#/`,
      // icon: p.icon,
    })),
  ];

  return (
    <>
      <nav className="h-30 sticky top-0 z-[var(--hub-navbar-z-index)] flex w-full select-none items-center justify-center border-b border-b-neutral-100 bg-neutral-0">
        <div className="w-full max-w-[1280px] flex-col gap-2 p-3 md:px-6 md:pb-0 lg:gap-3">
          <div className="flex w-full items-center justify-between">
            <div className="pb-3 lg:ml-10">
              <Link
                href="/"
                className={classNames(
                  "flex items-center gap-x-5 rounded-full py-2 md:rounded-lg",
                  "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
                )}
              >
                <img src={PUB_PROJECT_LOGO} width="150" className="shrink-0" alt={PUB_APP_NAME + " logo"} />
              </Link>
              <div className="flex items-center gap-x-2">
                <span className="text-md leading-tight text-neutral-500">Governed on</span>
                <img src="/logo-aragon-text.svg" alt="Aragon" className="h-6" />
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <div className="shrink-0">
                <WalletContainer />
              </div>

              {/* Nav Trigger */}
              <button
                onClick={() => setShowMenu(true)}
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
          <ul className="hidden gap-x-10 md:flex lg:pl-10">
            {navLinks.map(({ id, name, path }) => (
              <NavLink name={name} path={path} id={id} key={id} />
            ))}
          </ul>
        </div>
      </nav>
      <MobileNavDialog open={showMenu} navLinks={navLinks} onOpenChange={setShowMenu} />
    </>
  );
};
