import { ReactNode, createContext, useContext } from "react";

type Booleanish = any;
const IfCaseContext = createContext<{ condition: Booleanish }>(null as any);

/**
 * Render when condition evaluates to true
 *
 * <If condition={a && b && c}>
 *    <p>True case</p>
 * </If>
 *
 * @param props {condition, children}
 * @returns
 */
export const If = ({
  condition,
  children,
}: {
  condition: Booleanish;
  children?: ReactNode;
}) => {
  if (!condition) return <></>;
  return children;
};

/**
 * Render when condition evaluates to false
 *
 * <IfNot condition={a && b && c}>
 *    <p>False case</p>
 * </IfNot>
 *
 * @param props {condition, children}
 * @returns
 */
export const IfNot = ({
  condition,
  children,
}: {
  condition: Booleanish;
  children?: ReactNode;
}) => {
  if (condition) return <></>;
  return children;
};

/**
 * Render the true and false cases
 *
 * <IfCase condition={a && b && c}>
 *    <Then>
 *       <p>True case</p>
 *    </Then>
 *    <Else>
 *       <p>False case</p>
 *    </Else>
 * </IfCase>
 *
 * @param props {condition, children}
 * @returns
 */
export const IfCase = ({
  condition,
  children,
}: {
  condition: Booleanish;
  children?: ReactNode;
}) => {
  return (
    <IfCaseContext.Provider value={{ condition }}>
      {children}
    </IfCaseContext.Provider>
  );
};

/**
 * Renders when the parent IfCase condition is true
 *
 * <IfCase condition={a && b && c}>
 *    <Then>
 *       <p>True case</p>
 *    </Then>
 * </IfCase>
 *
 * @param props {condition, children}
 * @returns
 */
export const Then = ({ children }: { children: ReactNode }) => {
  const value = useContext(IfCaseContext);
  if (value === null) {
    console.warn("<Then> should be placed within an <IfCase> block");
    return <></>;
  } else if (!value.condition) return <></>;
  return children;
};

/**
 * Renders when the parent IfCase condition is false
 *
 * <IfCase condition={a && b && c}>
 *    <Else>
 *       <p>False case</p>
 *    </Else>
 * </IfCase>
 *
 * @param props {condition, children}
 * @returns
 */
export const Else = ({ children }: { children: ReactNode }) => {
  const value = useContext(IfCaseContext);
  if (value === null) {
    console.warn("<Else> should be placed within an <IfCase> block");
    return <></>;
  } else if (value.condition) return <></>;
  return children;
};
