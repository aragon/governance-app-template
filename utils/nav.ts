import { type IBreadcrumbsLink } from "@aragon/ods";
import { capitalizeFirstLetter } from "./text";

/**
 * TODO: this function looks okay, but in practice generates incorrect breadcrumbs.
 * Examples include:
 *  - generating /proposals instead of /plugins/crosschain-voting/#/proposals
 */
export function generateBreadcrumbs(pathname: string): IBreadcrumbsLink[] {
  const paths = pathname.split("/").filter(Boolean).slice(-2);

  let pathAccumulator = "";

  return paths.map((path) => {
    pathAccumulator += `/${path}`;
    return {
      label: capitalizeFirstLetter(path),
      href: pathAccumulator,
    };
  });
}
