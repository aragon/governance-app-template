import { Tag } from "@aragon/ods";
import type { ITagProps } from "@aragon/ods";

type TagVariant = NonNullable<ITagProps["variant"]>;

export const StatusTag = ({
  label,
  variant,
}: {
  label: string;
  variant: TagVariant;
}) => {
  return (
    <Tag
      className={`px-6 py-5 rounded-lg border border-${variant}-300`}
      label={label}
      variant={variant}
    />
  );
};
