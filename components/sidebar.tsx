import Image from "next/image";
import Link from "next/link";
import { Icon, IconType, Button } from "@aragon/ods";
import { useRouter } from "next/router";
import { useState } from "react";
import { plugins } from "@/plugins";
import { type ParsedUrlQuery } from "querystring";
import { resolveQueryParam } from "@/utils/query";
import { PUB_DISCORD_URL } from "@/constants";
import { Else, If, Then } from "./if";
import { CloseIcon, MenuIcon } from "./icons";

const Sidebar = () => {
  const { pathname, query } = useRouter();
  const isHome = pathname === "/";
  const pluginId = resolvePluginId(pathname, query);
  const [isOpen, setIsOpen] = useState(false);

  const SidebarSwitchButton = () => (
    <Button
      size="sm"
      responsiveSize={{}}
      variant="tertiary"
      className="absolute z-50 ml-2 mt-2 block md:hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      <If condition={isOpen}>
        <Then>
          <CloseIcon className="fill-current h-6 w-6" />
        </Then>
        <Else>
          <MenuIcon className="fill-current h-6 w-6" />
        </Else>
      </If>
    </Button>
  );

  return (
    <header className="h-screen select-none">
      <SidebarSwitchButton />

      <div
        className={`flex h-screen flex-col justify-between bg-neutral-50 md:w-72 md:bg-neutral-100 ${
          isOpen ? "max-sm:absolute max-sm:w-full md:relative" : "max-sm:hidden"
        }`}
      >
        <div className="w-full">
          <div className="flex w-full items-center px-3 py-3 pt-14 md:pt-6">
            <Image src="/logo-bw-lg.png" width="60" height="60" className="mx-4 my-1 w-8" alt="Aragonette" />
            <Link
              href="/"
              className={`block py-1 text-xl font-semibold leading-tight text-neutral-700`}
              aria-current="page"
            >
              Aragonette
            </Link>
          </div>
          <MenuList isHome={isHome} setIsOpen={setIsOpen} pluginId={pluginId} />
        </div>
        <div className="w-full">
          <PoweredByAragon />
        </div>
      </div>
    </header>
  );
};

const MenuList = ({
  isHome,
  setIsOpen,
  pluginId,
}: {
  isHome: boolean;
  setIsOpen: (o: boolean) => any;
  pluginId: string | null;
}) => {
  return (
    <ul className="mt-6 px-6">
      {/* HOME */}
      <li
        onClick={() => setIsOpen(false)}
        className={`mb-2 flex w-full cursor-pointer items-center justify-between text-neutral-700 ${
          isHome ? "bg-neutral-100 font-semibold text-primary-500 md:bg-neutral-200" : ""
        } shadow-lg rounded-lg hover:bg-neutral-100 md:hover:bg-neutral-200`}
      >
        <Link href="/" className="flex w-full items-center p-3">
          <Icon className="mr-2" icon={IconType.HOME} size="lg" responsiveSize={{ md: "lg" }} />

          <span className={`block rounded py-2 pl-3 pr-4 ${isHome ? "font-semibold" : ""} lg:p-0`} aria-current="page">
            Home
          </span>
        </Link>
      </li>

      {/* PLUGINS */}
      {plugins.map((plugin, idx) => (
        <li
          key={idx}
          onClick={() => setIsOpen(false)}
          className={`mb-2 flex w-full cursor-pointer items-center justify-between text-neutral-700 ${
            plugin.id === pluginId
              ? "shadow-lg rounded-lg bg-neutral-100 font-semibold text-primary-500 md:bg-neutral-200"
              : ""
          } shadow-lg rounded-lg hover:bg-neutral-100 md:hover:bg-neutral-200`}
        >
          <Link
            href={`/plugins/${plugin.id}/#/`}
            className="focus:ring-2 focus:ring-white flex w-full items-center p-3 focus:outline-none"
          >
            <Icon className="mr-2" icon={plugin.icon} size="md" responsiveSize={{ md: "lg" }} />
            <span className="block py-2 pl-3 pr-4 lg:p-0">{plugin.title}</span>
          </Link>
        </li>
      ))}

      {/* EXTERNAL LINKS */}
      <li
        className={`shadow-lg mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg text-neutral-700 hover:bg-neutral-100 md:hover:bg-neutral-200`}
      >
        <Link href={PUB_DISCORD_URL} target="_blank" className="flex w-full items-center p-3">
          <Icon className="mr-2" icon={IconType.HELP} size="md" responsiveSize={{ md: "lg" }} />
          <span className="block py-2 pl-3 pr-4 lg:p-0">Discord</span>
        </Link>
      </li>
    </ul>
  );
};

const PoweredByAragon = () => {
  return (
    <div className="mb-3 flex w-full justify-center">
      <Link href="https://aragon.org" className="focus:ring-2 focus:ring-white flex items-center focus:outline-none">
        <span className="block flex flex-row py-2 pl-3 pr-4 lg:border-0">
          Powered by <span className="mr-1 font-semibold text-primary-400">&nbsp;Aragon</span>
          <Image src="/logo.png" width="24" height="20" className="" alt="Aragonette" />
        </span>
      </Link>
    </div>
  );
};

function resolvePluginId(pathname: string, queryParams: ParsedUrlQuery): string | null {
  if (pathname !== "/plugins/[id]") return null;

  return resolveQueryParam(queryParams.id) || null;
}

export default Sidebar;
