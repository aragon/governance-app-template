import { Children, ReactNode } from "react";

export const getChildrenText = (children: ReactNode) => {
  let label = "";

  Children.map(children, (child) => {
    if (typeof child === "string") {
      label += child;
    }
  });

  return label;
};
