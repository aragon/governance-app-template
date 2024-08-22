import React, { type ReactNode } from "react";

interface IHeaderSectionProps {
  children?: ReactNode;
}
export const HeaderSection: React.FC<IHeaderSectionProps> = (props) => {
  const { children } = props;

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-4 py-6 md:px-16 md:py-10">{children}</div>
  );
};
