import { Icon, IconType } from "@aragon/ods";

export const AddActionCard = ({
  title,
  icon,
  onClick,
  disabled,
}: {
  title: string;
  icon: IconType;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  if (disabled) {
    return (
      <div className="flex cursor-not-allowed select-none flex-col items-center rounded-xl border-2 border-solid border-neutral-100 bg-neutral-50">
        <Icon className={"mt-1 !h-12 !w-10 p-2 text-neutral-400 "} icon={icon} size="lg" />
        <span className="mb-3 text-center text-sm text-neutral-400">{title}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.()}
      className="flex cursor-pointer select-none flex-col items-center rounded-xl border-2 border-solid border-neutral-100 bg-neutral-0 hover:border-primary-300 active:bg-neutral-50"
    >
      <Icon className={"mt-1 !h-12 !w-10 p-2 text-neutral-400 "} icon={icon} size="lg" />
      <span className="mb-3 text-center text-sm text-neutral-400">{title}</span>
    </div>
  );
};
