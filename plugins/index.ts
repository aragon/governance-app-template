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
    id: "tokenVoting",
    title: "Community proposals",
    icon: IconType.APP_GOVERNANCE,
    pluginAddress: process.env.NEXT_PUBLIC_PLUGIN_ADDRESS ?? "",
  },
  {
    id: "delegateAnnouncer",
    title: "Delegation",
    icon: IconType.APP_COMMUNITY,
    pluginAddress: process.env.NEXT_PUBLIC_DELEGATION_CONTRACT ?? "",
  },
];
