import React, { ReactElement, ReactNode } from "react";
import { IfProps } from "./types";

/**
 * Renders the inner children or the first Then child when the condition evaluates to true
 *
 * ```
 * <If true={age === 18}> rendered </If>
 * <If not={age === 18}> rendered </If>
 *
 * <If all={[age > 18, name.includes("John"), height >= 180]}> rendered </If>
 * <If some={[age > 18, name.includes("John"), height >= 180]}> rendered </If>
 * <If notAll={[age > 18, name.includes("John"), height >= 180]}> rendered </If>
 * <If none={[age > 18, name.includes("John"), height >= 180]}> rendered </If>
 *
 * <If val={age} is={18}> rendered </If>
 * <If val={age} isNot={18}> rendered </If>
 * <If val={age} above={18}> rendered </If>
 * <If val={age} below={18}> rendered </If>
 * <If val={age} atLeast={18}> rendered </If>
 * <If val={age} atMost={18}> rendered </If>
 *
 * <If lengthOf={["a", "b", "c"]} is={3}> rendered </If>
 * <If lengthOf={["a", "b", "c"]} isNot={3}> rendered </If>
 * <If lengthOf={["a", "b", "c"]} above={3}> rendered </If>
 * <If lengthOf={["a", "b", "c"]} below={3}> rendered </If>
 * <If lengthOf={["a", "b", "c"]} atLeast={3}> rendered </If>
 * <If lengthOf={["a", "b", "c"]} atMost={3}> rendered </If>
 *
 * <If val={age} atLeast={18}>
 *   <Then>
 *     <p>Of legal age</p>
 *   </Then>
 *   <ElseIf val={age} atLeast={16}>
 *     <p>Can drive but not vote</p>
 *   </ElseIf>
 *   <ElseIf val={age} atLeast={14}>
 *     <p>Can drive a small scooter</p>
 *   </ElseIf>
 *   <Else>
 *     <p>Still too young</p>
 *   </Else>
 * </If>
 * ```
 *
 * @param props {IfProps}
 * @returns
 */
export const If = (props: IfProps) => {
  const { children } = props;
  if (!children) return <></>;

  const mainConditionValue = resolveCondition(props);

  // Many children
  if (Array.isArray(children) && hasConditionalChildren(children)) {
    if (mainConditionValue) {
      // Match Then elements only
      for (const child of children) {
        if (child.type === Then) {
          return child.props?.children;
        }
      }
    } else {
      for (const child of children) {
        // Match ElseIf elements only
        if (child.type === ElseIf) {
          const subConditionValue = resolveCondition(child.props);
          if (subConditionValue) return child.props?.children;
          // Continue trying other ElseIf's
        }
      }

      for (const child of children) {
        // Match Else elements only
        if (child.type === Else) {
          return child.props?.children;
        }
      }
      // Do not render unknown nodes within an array of children
    }
    // No match
    return <></>;
  }
  // Single child
  else if (typeof children !== "object") {
    if (!mainConditionValue) return <></>;

    // Basic types (string, number, boolean)
    return children;
  }

  const child = children as ReactElement;
  // Match the Then/ElseIf/Else elements first
  if (child.type === Then) {
    if (mainConditionValue) return child.props?.children;
    return <></>;
  } else if (child.type === ElseIf) {
    if (mainConditionValue) return <></>;

    const subConditionValue = resolveCondition(child.props);
    if (subConditionValue) return child.props?.children;
  } else if (child.type === Else) {
    if (!mainConditionValue) return child.props?.children;
    return <></>;
  }

  // Fallback for extraneous cases
  if (!mainConditionValue) return <></>;

  return children;
};

/**
 * Renders when the parent If condition is true
 *
 * ```
 * <If all={[a, b, c]}>
 *   <Then>
 *     <p>a, b, and c are true</p>
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
export const Then = ({ children }: { children?: ReactNode }) => {
  return children;
};

/**
 * Renders when the preceding If or ElseIf conditions are false and the current condition matches
 *
 * ```
 * <If val={age} atLeast={18}>
 *   <Then>
 *     <p>Of legal age</p>
 *   </Then>
 *   <ElseIf val={age} atLeast={16}>
 *     <p>Can drive but not vote</p>
 *   </ElseIf>
 *   <ElseIf val={age} atLeast={14}>
 *     <p>Can drive a small scooter</p>
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
 * Renders when the parent If and ElseIf conditions are false
 *
 * ```
 * <If val={age} below={14}>
 *   <Then>
 *     <p>You are too young</p>
 *   </Then>
 *   <ElseIf val={age} below={16}>
 *     <p>Can drive a small scooter</p>
 *   </ElseIf>
 *   <ElseIf val={age} below={18}>
 *     <p>Can drive but not vote</p>
 *   </ElseIf>
 *   <Else>
 *     <p>You are of legal age</p>
 *   </Else>
 * </If>
 * ```
 *
 * @param props {children}
 * @returns
 */
export const Else = ({ children }: { children?: ReactNode }) => {
  return children;
};

// Internal

function hasConditionalChildren(children: ReactNode): boolean {
  if (!Array.isArray(children)) {
    return isConditionalChild(children as ReactElement);
  }
  for (const item of children) {
    if (isConditionalChild(item)) return true;
  }
  return false;
}

function isConditionalChild(node: ReactElement) {
  return node.type === Then || node.type === ElseIf || node.type === Else;
}

function resolveCondition(props: IfProps): boolean {
  if ("true" in props) return !!props.true;
  else if ("not" in props) return !props.not;
  else if ("val" in props) {
    if ("is" in props) return props.val === props.is;
    else if ("isNot" in props) return props.val !== props.isNot;
    else if ("above" in props) return (props.val as number) > props.above;
    else if ("below" in props) return (props.val as number) < props.below;
    else if ("atLeast" in props) return (props.val as number) >= props.atLeast;
    else if ("atMost" in props) return (props.val as number) <= props.atMost;
  } else if ("lengthOf" in props) {
    if ("is" in props) {
      if (!props.lengthOf) return 0 === props.is;
      return props.lengthOf.length === props.is;
    } else if ("isNot" in props) {
      if (!props.lengthOf) return 0 !== props.isNot;
      return props.lengthOf.length !== props.isNot;
    } else if ("above" in props) {
      if (!props.lengthOf) return 0 > props.above;
      return props.lengthOf.length > props.above;
    } else if ("below" in props) {
      if (!props.lengthOf) return 0 < props.below;
      return props.lengthOf.length < props.below;
    } else if ("atLeast" in props) {
      if (!props.lengthOf) return 0 >= props.atLeast;
      return props.lengthOf.length >= props.atLeast;
    } else if ("atMost" in props) {
      if (!props.lengthOf) return 0 <= props.atMost;
      return props.lengthOf.length <= props.atMost;
    }
  } else if ("all" in props) {
    for (const c of props.all) if (!c) return false;
    return true;
  } else if ("some" in props) {
    for (const c of props.some) if (c) return true;
    return false;
  } else if ("notAll" in props) {
    for (const c of props.notAll) if (!c) return true;
    return false;
  } else if ("none" in props) {
    for (const c of props.none) if (c) return false;
    return true;
  }

  return false;
}
