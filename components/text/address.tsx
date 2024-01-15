import { Children, ReactNode } from "react";

export const AddressText = ({ children }: { children: ReactNode }) => {
  const address = getChildrenText(children);

  return <span className="text-primary-500 underline">{address}</span>;
};

const getChildrenText = (children: ReactNode) => {
  let label = "";

  Children.map(children, (child) => {
    if (typeof child === "string") {
      label += child;
    }
  });

  return label;
};
