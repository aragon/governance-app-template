import { Address } from "viem";
import { ChainName, getChain } from "./utils/chains";

// Contract Addresses
export const PUB_DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS ?? "") as Address;
export const PUB_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "") as Address;

export const PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_LOCK_TO_VOTE_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS ??
  "") as Address;
export const PUB_TOKEN_VOTING_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_DELEGATION_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DELEGATION_CONTRACT_ADDRESS ?? "") as Address;

export const PUB_DELEGATION_ANNOUNCEMENTS_START_BLOCK = BigInt(
  process.env.NEXT_PUBLIC_DELEGATION_ANNOUNCEMENTS_START_BLOCK || "0"
);

// Target chain
export const PUB_CHAIN_NAME = (process.env.NEXT_PUBLIC_CHAIN_NAME ?? "sepolia") as ChainName;
export const PUB_CHAIN = getChain(PUB_CHAIN_NAME);

// Network and services
export const PUB_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";

export const PUB_WEB3_ENDPOINT = (process.env.NEXT_PUBLIC_WEB3_URL_PREFIX ?? "") + PUB_ALCHEMY_API_KEY;

export const PUB_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";

export const PUB_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";

export const PUB_IPFS_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_ENDPOINT ?? "";
export const PUB_IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY ?? "";

// General
export const PUB_APP_NAME = "Aragonette";
export const PUB_APP_DESCRIPTION = "Simplified user interface for Aragon DAO's";

export const PUB_PROJECT_URL = "https://aragon.org/";
export const PUB_WALLET_ICON = "https://avatars.githubusercontent.com/u/37784886";

export const PUB_DISCORD_URL = "https://discord.com/";
