import { Address } from "viem";

// General
export const PUB_APP_PAGE_TITLE = "Aragonette";
export const PUB_DISCORD_URL = "https://discord.com/";

// Contract Addresses
export const PUB_DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS ??
  "") as Address;
export const PUB_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ??
  "") as Address;

export const PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS = (process.env
  .NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_TOKEN_VOTING_PLUGIN_ADDRESS = (process.env
  .NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_DELEGATION_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_DELEGATION_CONTRACT_ADDRESS ?? "") as Address;

// API keys - network
export const PUB_ETHERSCAN_API_KEY =
  process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";

export const PUB_WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";

export const PUB_ALCHEMY_API_KEY =
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";

export const PUB_IPFS_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_ENDPOINT ?? "";
export const PUB_IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY ?? "";
