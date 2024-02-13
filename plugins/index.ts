import { IconType } from "@aragon/ods";

type PluginItem = {
  title: string;
  folderName: string;
  icon: IconType;
};

export const plugins: PluginItem[] = [
  {
    title: "Proposals (main)",
    folderName: "tokenVoting",
    icon: IconType.APP_GOVERNANCE,
  },
  {
    title: "Delegates",
    folderName: "delegateAnnouncer",
    icon: IconType.APP_COMMUNITY,
  },
];
