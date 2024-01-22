import { Tag } from "@aragon/ods";
import { TagVariant } from "@aragon/ods/dist/types/src/components/tag/tag";

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
