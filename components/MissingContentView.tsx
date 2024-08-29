import { Button, IllustrationHuman } from "@aragon/ods";
import { ReactNode } from "react";

export const MissingContentView = ({
  children,
  callToAction,
  onClick,
  isLoading,
}: {
  children: ReactNode;
  callToAction?: string;
  onClick?: () => any;
  isLoading?: boolean;
}) => {
  if (!callToAction) {
    return (
      <div className="w-full">
        <p className="text-md text-neutral-400">{children}</p>
        <Illustration />
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-md text-neutral-400">{children}</p>
      <Illustration />
      <div className="flex justify-center">
        <Button size="md" variant="primary" isLoading={!!isLoading} onClick={onClick ? onClick : () => {}}>
          <span>{callToAction}</span>
        </Button>
      </div>
    </div>
  );
};

function Illustration() {
  return <IllustrationHuman className="mx-auto my-8 max-w-96" body="VOTING" expression="SMILE_WINK" hairs="CURLY" />;
}
