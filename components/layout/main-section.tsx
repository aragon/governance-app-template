import React, { type ReactNode } from "react";

interface IMainSectionProps {
  children?: ReactNode;
  narrow?: boolean;
}

export const MainSection: React.FC<IMainSectionProps> = (props) => {
  const { children, narrow } = props;

  if (narrow) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-6 md:pb-20 lg:pt-10">
        <div className="mx-auto flex w-full max-w-[768px] flex-col items-center gap-y-6 md:px-6">{children}</div>
      </div>
    );
  }
  return <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-16 md:pb-20 lg:pt-10">{children}</div>;
};
