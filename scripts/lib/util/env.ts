import "dotenv/config";

export function getEnv(key: string, required = false): string {
  if (!key.toUpperCase().startsWith("DEPLOYMENT_")) {
    throw new Error("getEnv only supports private variables meant for deployment");
  }
  const value = process.env[key] ?? ("" as any);

  if (required && !value) {
    console.error("Error: " + key + " is required to run the script");
    process.exit(1);
  }
  return value;
}
