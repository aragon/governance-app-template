import { modulesCopy } from "@aragon/ods";
import NextLink from "next/link";
import { ComponentProps } from "react";

export const customModulesCopy = {
  ...modulesCopy,
  majorityVotingResult: {
    ...modulesCopy.majorityVotingResult,
    // Overridding the default "Winning option" text, which doesn't apply to vetoing proposals
    winningOption: "Proposal vetoes",
  },
};

const CustomLink: React.FC<ComponentProps<"a">> = ({ href = {}, ...otherProps }) => {
  if (href == null) {
    return otherProps.children;
  }

  return <NextLink href={href} {...otherProps} />;
};
export const odsCoreProviderValues = { Link: CustomLink };
