import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import { resolveQueryParam } from "@/utils/query";

interface INavLinkProps {
  id: string;
  label: string;
  path: string;
}

export const NavLink: React.FC<INavLinkProps> = (props) => {
  const { id, label, path } = props;
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

  return (
    <Link href={path} aria-current={selected ? "page" : undefined}>
      <div
        className={classNames("py-3", {
          "border-b-2 border-b-primary-400": selected,
        })}
      >
        <span
          className={classNames("text-neutral-500", {
            "text-neutral-800": selected,
          })}
        >
          {label}
        </span>
      </div>
    </Link>
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
