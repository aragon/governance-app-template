import { type IBreadcrumbsLink } from "@aragon/ods";
import { capitalizeFirstLetter } from "./text";

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
