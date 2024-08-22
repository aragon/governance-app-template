import { type IResource } from "@/utils/types";
import { Address } from "viem";

export type DelegateAnnounce = {
  logIndex: number;
  delegate: Address;
  dao: Address;
  contentUri: string;
};

export interface IAnnouncementMetadata {
  identifier: string;
  bio: string;
  message: string;
  resources?: IResource[];
}
