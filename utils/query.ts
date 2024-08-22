export function resolveQueryParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  else if (Array.isArray(value)) return value[0];
  return "";
}

export const generateDataListState = (
  isLoading: boolean,
  isError: boolean,
  isFetchingNextPage?: boolean,
  isFiltering?: boolean,
  isFiltered?: boolean
) => {
  if (isLoading) {
    return "initialLoading";
  } else if (isError) {
    return "error";
  } else if (isFetchingNextPage) {
    return "fetchingNextPage";
  } else if (isFiltering) {
    return "loading";
  } else {
    return isFiltered ? "filtered" : "idle";
  }
};
