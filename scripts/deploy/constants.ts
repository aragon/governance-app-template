import { SupportedNetworks } from "@aragon/osx-commons-configs";
// import { activeContractsList } from "@aragon/osx-artifacts";
import { getEnv } from "../util/env";

// NETWORK
export const DEPLOYMENT_TARGET_CHAIN_ID = (getEnv(
  "DEPLOYMENT_TARGET_CHAIN_ID",
  true
) ?? "goerli") as SupportedNetworks;

// DAO
export const DEPLOYMENT_DAO_NAME = "Aragonette DAO";
export const DEPLOYMENT_DAO_DESCRIPTION = "This is a very flexible DAO.";

// NOTE:
// Enter a value in order to request a new dao.eth subdomain (where available)
// Be sure to define a name when the full setup is validated.
// Once a dao.eth subdomain is assigned it cannot be transferred.
export const DEPLOYMENT_ENS_SUBDOMAIN = "";

// PLUGINS

// TOKEN VOTING

// DUAL GOVERNANCE
export const DUAL_GOVERNANCE_ENS_SUBDOMAIN =
  "dual-test-" + Math.random().toString().slice(2);

// OTHER
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
