import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import { resolveQueryParam } from "@/utils/query";
import { Icon, type IconType } from "@aragon/ods";

export interface INavLink {
  path: string;
  id: string;
  name: string;
  icon?: IconType;
}

interface INavLinkProps extends INavLink {
  onClick?: () => void;
}

export const NavLink: React.FC<INavLinkProps> = (props) => {
  const { icon, id, name, path, onClick } = props;
  const { pathname, query } = useRouter();
  const pluginId = resolvePluginId(pathname, query);

  const isHome = path === "/";
  const isPluginPathname = pathname === "/plugins/[id]";

  let selected;
  if (isHome) {
    // strict comparison for home page
    selected = pathname === path;
  } else if (isPluginPathname) {
    // compare resolved pluginId from query params with plugin id
    selected = pluginId === id;
  } else {
    // check if current path starts with tab path so that
    // the nav item is selected when the user is on a nested page
    selected = pathname.startsWith(path);
  }

  const containerClasses = classNames(
    "group relative md:-mb-0.25 md:border-b md:hover:border-b-neutral-800", // base styles
    {
      "md:border-b-transparent md:active:border-b-primary-400": !selected, // unselected link styles
      "md:border-b-primary-400 md:hover:border-b-primary-400": selected, // base selected link styles

      // using after so that the size of the links don't change when one is selected and active
      "md:after:bg-primary-400 md:after:content-[attr(aria-current)] md:active:after:hidden": selected,
      "md:after:absolute md:after:-bottom-0 md:after:left-0 md:after:right-0 md:after:h-[1px]": selected,
    }
  );

  const anchorClasses = classNames(
    "w-full py-3", // base styles
    "group-hover:text-neutral-800", // hover styles
    "outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset", // focus styles
    "flex h-12 flex-1 items-center justify-between gap-3 rounded-xl px-4 leading-tight", // mobile styles
    "md:h-11 md:rounded-none md:px-0 md:leading-normal", // desktop nav styles
    {
      "bg-neutral-50 md:bg-neutral-0": selected,
    }
  );

  return (
    <li key={id} className={containerClasses}>
      <Link href={path} onClick={onClick} aria-current={selected ? "page" : undefined} className={anchorClasses}>
        {icon != null && (
          <Icon
            icon={icon}
            size="md"
            className={classNames("text-neutral-300 group-hover:text-neutral-800 lg:hidden", {
              "text-neutral-800": selected,
            })}
          />
        )}
        <span
          className={classNames("flex-1 truncate text-neutral-500 group-hover:text-neutral-800", {
            "text-neutral-800": selected,
          })}
        >
          {name}
        </span>
      </Link>
    </li>
  );
};

/**
 * Resolves the plugin ID from the given pathname and query parameters.
 *
 * @param pathname - The current pathname.
 * @param queryParams - The parsed query parameters.
 * @returns The resolved plugin ID or null if the pathname is not "/plugins/[id]"
 * or the ID is not found in the query parameters.
 */
function resolvePluginId(pathname: string, queryParams: ParsedUrlQuery): string | null {
  if (pathname !== "/plugins/[id]") return null;

  return resolveQueryParam(queryParams.id) || null;
}
