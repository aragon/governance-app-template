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
    pluginAddress: process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS ?? "",
  },
  {
    id: "tokenVoting",
    title: "Community proposals",
    icon: IconType.APP_GOVERNANCE,
    pluginAddress: process.env.NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS ?? "",
  },
  {
    id: "delegateAnnouncer",
    title: "Delegation",
    icon: IconType.APP_COMMUNITY,
    pluginAddress: process.env.NEXT_PUBLIC_DELEGATION_CONTRACT ?? "",
  },
];
