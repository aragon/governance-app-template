import {
  PUB_DELEGATION_CONTRACT_ADDRESS,
  PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
} from "@/constants";
import { IconType } from "@aragon/ods";

type PluginItem = {
  /** The name of the folder within `/plugins` */
  id: string;
  title: string;
  icon: IconType;
  pluginAddress: string;
};

export const plugins: PluginItem[] = [
  {
    id: "dualGovernance",
    title: "Core Proposals",
    icon: IconType.BLOCKCHAIN,
    pluginAddress: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  },
  {
    id: "tokenVoting",
    title: "Community proposals",
    icon: IconType.APP_GOVERNANCE,
    pluginAddress: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  },
  {
    id: "delegateAnnouncer",
    title: "Delegation",
    icon: IconType.APP_COMMUNITY,
    pluginAddress: PUB_DELEGATION_CONTRACT_ADDRESS,
  },
];
