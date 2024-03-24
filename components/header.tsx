import Image from "next/image";
import Link from "next/link";
import { Icon, IconType, Button } from "@aragon/ods";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { plugins } from "@/plugins";
import { PUB_DISCORD_URL } from "@/constants";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount } from "wagmi";
import { resolveQueryParam } from "@/utils/query";
import { Else, If, Then } from "@/components/if";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import WalletContainer from "./WalletContainer";

const Header = () => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { pathname, query } = useRouter();
  const isHome = pathname === "/";
  const pluginId = resolvePluginId(pathname, query);
  const [isOpen, setIsOpen] = useState(false);



  const skipRender = useSkipFirstRender();
  if (skipRender) return <></>;

  return (
    <header
      className="flex flex-col w-full justify-between items-center"
      style={{ backgroundColor: "white" }}>
      <div className="flex w-full justify-between lg:w-4/5 2xl:w-4/5 p-4">
        <div className="items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/logo-bw-lg.png"
              width="60"
              height="60"
              className="w-9 mr-3"
              alt="Aragonette"
            />
            <Link
              href="/"
              className={`block py-1 leading-tight font-semibold text-xl text-neutral-700`}
              aria-current="page"
            >
              Aragonette
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <If condition={isConnected}>
            <Then>
              <WalletContainer />
            </Then>
            <Else>
              <Button className="" size="md" variant="primary" onClick={() => open()}>
                Connect wallet
              </Button>
            </Else>
          </If>
        </div>
      </div>
      <MenuList isHome={isHome} setIsOpen={setIsOpen} pluginId={pluginId} />
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
    <div className="flex w-full mt-4 justify-start lg:justify-center">
      <ul className="flex w-full lg:w-4/5 2xl:w-4/5 px-0 lg:px-10">
        {/* HOME */}
        <li
          onClick={() => setIsOpen(false)}
          className={`flex justify-between text-neutral-500 cursor-pointer items-center xl:mx-3 ${isHome
            ? "text-neutral-800 border-primary-400 border-b-4"
            : ""
            } hover:text-neutral-800`}
        >
          <Link href="/" className="flex items-center w-full p-3">
            <span
              className={`block py-2 pr-4 pl-3 rounded ${isHome ? "font-semibold" : ""
                } lg:p-0`}
              aria-current="page"
            >
              Home
            </span>
          </Link>
        </li>

        {/* PLUGINS */}
        {plugins.map((plugin, idx) => (
          <li
            key={idx}
            onClick={() => setIsOpen(false)}
            className={`flex justify-between text-neutral-500 cursor-pointer items-center xl:mx-3 ${plugin.id === pluginId
              ? "text-neutral-800 border-primary-400 border-b-4"
              : ""
              } hover:text-neutral-800`}
          >
            <Link
              href={"/plugins/" + plugin.id + "/#/"}
              className="flex items-center w-full p-3"
            >
              <span className="block py-2 pr-4 pl-3 lg:p-0">{plugin.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

function resolvePluginId(
  pathname: string,
  queryParams: ParsedUrlQuery
): string | null {
  if (pathname !== "/plugins/[id]") return null;

  return resolveQueryParam(queryParams.id) || null;
}

export default Header;
