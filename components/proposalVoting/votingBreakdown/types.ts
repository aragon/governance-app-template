import { type IButtonProps } from "@aragon/ods";

export type VotingCta = Pick<IButtonProps, "disabled" | "isLoading"> & {
  label?: string;
  onClick?: (value?: number) => void;
};
