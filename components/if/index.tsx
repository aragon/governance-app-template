import React, { ReactElement, ReactNode } from 'react';

type Booleanish = any;
type IfProps =
  | { condition: Booleanish; children?: ReactNode }
  | { not: Booleanish; children?: ReactNode };

/**
 * Renders the block where the condition evaluates to true
 *
 * ```
 * <If condition={a && b && c}>
 *    <p>The condition is true</p>
 * </If>
 *
 * <If not={a && b && c}>
 *    <p>The condition is false</p>
 * </If>
 *
 * <If condition={a && b && c}>
 *   <Then>
 *     <p>Condition 1 is true</p>
 *   </Then>
 *   <ElseIf condition={ d && e }>
 *     <p>Condition 2 is true</p>
 *   </ElseIf>
 *   <ElseIf not={ f || g }>
 *     <p>Condition 3 is false</p>
 *   </ElseIf>
 *   <Else>
 *     <p>All conditions are false</p>
 *   </Else>
 * </If>
 *
 * <If not={a && b && c}>
 *   <Then>
 *     <p>Condition 1 is false</p>
 *   </Then>
 *   <ElseIf condition={ d && e }>
 *     <p>Condition 2 is true</p>
 *   </ElseIf>
 *   <ElseIf not={ f || g }>
 *     <p>Condition 3 is false</p>
 *   </ElseIf>
 *   <Else>
 *     <p>All conditions are false</p>
 *   </Else>
 * </If>
 * ```
 *
 * @param props {condition, children}
 * @returns
 */
export const If = (props: IfProps) => {
  const { children } = props;
  if (!children) return <></>;

  const mainCondition = resolveCondition(props);

  // Many children
  if (Array.isArray(children)) {
    for (const child of children) {
      // Match the Then/ElseIf/Else elements only
      if (child.type === Then) {
        if (mainCondition) return child.props?.children;
      } else if (child.type === ElseIf) {
        if (!mainCondition) {
          const subCondition = resolveCondition(child.props);
          if (subCondition) return child.props?.children;
        }
        // Continue trying other ElseIf's
      } else if (child.type === Else) {
        if (!mainCondition) return child.props?.children;
      }
      // Do not render unknown nodes within an array of children
    }
    // No match
    return <></>;
  }
  // One child
  else if (typeof children !== 'object') {
    if (!mainCondition) return <></>;

    return children;
  }

  const child = children as ReactElement;
  // Match the Then/ElseIf/Else elements first
  if (child.type === Then) {
    if (mainCondition) return child.props?.children;
    return <></>;
  } else if (child.type === ElseIf) {
    if (!mainCondition) {
      const subCondition = resolveCondition(child.props);
      if (subCondition) return child.props?.children;
    }
    return <></>;
  } else if (child.type === Else) {
    if (!mainCondition) return child.props?.children;
    return <></>;
  }

  // Fallback for extraneous cases
  if (!mainCondition) return <></>;

  return children;
};

/**
 * Renders when the parent If condition is true
 *
 * ```
 * <If condition={a && b && c}>
 *   <Then>
 *     <p>Condition 1 is true</p>
 *   </Then>
 *   <Else>
 *     <p>All conditions are false</p>
 *   </Else>
 * </If>
 * ```
 *
 * @param props {children}
 * @returns
 */
export const Then = ({ children }: { children: ReactNode }) => {
  return children;
};

/**
 * Renders when the parent If condition is false
 *
 * ```
 * <If condition={a && b && c}>
 *   <Then>
 *     <p>Condition 1 is true</p>
 *   </Then>
 *   <ElseIf condition={ d && e }>
 *     <p>Condition 2 is true</p>
 *   </ElseIf>
 *   <ElseIf not={ d && e }>
 *     <p>Condition 3 is false</p>
 *   </ElseIf>
 * </If>
 * ```
 *
 * @param props {children}
 * @returns
 */
export const ElseIf = ({ children }: IfProps) => {
  return children;
};

/**
 * Renders when the parent If condition is false
 *
 * ```
 * <If condition={a && b && c}>
 *   <Then>
 *     <p>Condition 1 is true</p>
 *   </Then>
 *   <ElseIf condition={ d && e }>
 *     <p>Condition 2 is true</p>
 *   </ElseIf>
 *   <Else>
 *     <p>All conditions are false</p>
 *   </Else>
 * </If>
 * ```
 *
 * @param props {children}
 * @returns
 */
export const Else = ({ children }: { children: ReactNode }) => {
  return children;
};

// Helpers

function resolveCondition(props: IfProps): boolean {
  if (
    typeof (props as any).condition !== 'undefined' &&
    typeof (props as any).not !== 'undefined'
  ) {
    throw new Error(
      "Either 'condition' or 'not' are required as an <If> prop, but not both"
    );
  } else if (typeof (props as any).condition !== 'undefined') {
    return (props as any).condition;
  }
  return !(props as any).not;
}
