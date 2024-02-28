export function decodeCamelCase(input?: string): string {
  if (!input || typeof input !== "string") return "";
  return (
    input
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
      // uppercase the first character
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
  );
}
