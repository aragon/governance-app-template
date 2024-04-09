export function resolveQueryParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  else if (Array.isArray(value)) return value[0];
  return "";
}
