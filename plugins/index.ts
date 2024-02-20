import {
  PUB_DELEGATION_CONTRACT_ADDRESS,
  PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
} from "@/constants";
import { IconType } from "@aragon/ods";

type PluginItem = {
  /** The URL fragment after /plugins */
  id: string;
  /** The name of the folder within `/plugins` */
  folderName: string;
  /** Title on menu */
  title: string;
  icon: IconType;
  pluginAddress: string;
};

export const plugins: PluginItem[] = [
  {
    id: "core-proposals",
    folderName: "dualGovernance",
    title: "Core Proposals",
    icon: IconType.BLOCKCHAIN,
    pluginAddress: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  },
  {
    id: "community-proposals",
    folderName: "tokenVoting",
    title: "Community proposals",
    icon: IconType.APP_GOVERNANCE,
    pluginAddress: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  },
  {
    id: "delegate-wall",
    folderName: "delegateAnnouncer",
    title: "Delegation",
    icon: IconType.APP_COMMUNITY,
    pluginAddress: PUB_DELEGATION_CONTRACT_ADDRESS,
  },
];
