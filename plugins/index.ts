import {
  PUB_DELEGATION_CONTRACT_ADDRESS,
  PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
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
    title: "Core team proposals",
    icon: IconType.APP_MEMBERS,
    pluginAddress: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  },
  {
    id: "community-proposals",
    folderName: "tokenVoting",
    title: "Community proposals",
    icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  },
  {
    id: "lock-to-vote",
    folderName: "lockToVote",
    title: "Morpho Vault",
    icon: IconType.BLOCKCHAIN_BLOCK,
    pluginAddress: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
  },
  {
    id: "delegate-wall",
    folderName: "delegateAnnouncer",
    title: "Delegation",
    icon: IconType.FEEDBACK,
    pluginAddress: PUB_DELEGATION_CONTRACT_ADDRESS,
  },
];
