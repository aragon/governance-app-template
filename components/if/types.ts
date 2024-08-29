import { ReactNode } from "react";

type Booleanish = any;
type SimpleValue = string | number | bigint | boolean;
type NumericValue = number | bigint;
type ItemWithLength = string | Array<any> | { length: number };

export type IfProps =
  // Single
  | { true: Booleanish; children?: ReactNode }
  | { not: Booleanish; children?: ReactNode }
  // List
  | { all: Array<Booleanish>; children?: ReactNode }
  | { some: Array<Booleanish>; children?: ReactNode }
  | { notAll: Array<Booleanish>; children?: ReactNode }
  | { none: Array<Booleanish>; children?: ReactNode }
  // Compare
  | {
      val: SimpleValue | undefined | null;
      is: SimpleValue;
      children?: ReactNode;
    }
  | {
      val: SimpleValue | undefined | null;
      isNot: SimpleValue;
      children?: ReactNode;
    }
  | {
      val: NumericValue | undefined | null;
      above: NumericValue;
      children?: ReactNode;
    }
  | {
      val: NumericValue | undefined | null;
      atLeast: NumericValue;
      children?: ReactNode;
    }
  | {
      val: NumericValue | undefined | null;
      below: NumericValue;
      children?: ReactNode;
    }
  | {
      val: NumericValue | undefined | null;
      atMost: NumericValue;
      children?: ReactNode;
    }
  // Compare lengths
  | {
      lengthOf: ItemWithLength | undefined | null;
      is: NumericValue;
      children?: ReactNode;
    }
  | {
      lengthOf: ItemWithLength | undefined | null;
      isNot: NumericValue;
      children?: ReactNode;
    }
  | {
      lengthOf: ItemWithLength | undefined | null;
      above: NumericValue;
      children?: ReactNode;
    }
  | {
      lengthOf: ItemWithLength | undefined | null;
      atLeast: NumericValue;
      children?: ReactNode;
    }
  | {
      lengthOf: ItemWithLength | undefined | null;
      below: NumericValue;
      children?: ReactNode;
    }
  | {
      lengthOf: ItemWithLength | undefined | null;
      atMost: NumericValue;
      children?: ReactNode;
    };
