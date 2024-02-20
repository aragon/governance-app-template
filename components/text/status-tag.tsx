import { Tag } from "@aragon/ods";
import type { TagVariant } from "@aragon/ods";

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
