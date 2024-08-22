import { Card, DocumentParser, Heading } from "@aragon/ods";
import React from "react";

interface IDelegationStatementProps {
  message: string | undefined;
}

export const DelegationStatement: React.FC<IDelegationStatementProps> = ({ message }) => {
  if (!message) return;

  return (
    <>
      <Card className="w-full p-4 shadow-neutral md:p-6">
        <div className="flex flex-col gap-y-4">
          <Heading size="h2">Delegation statement</Heading>
          <hr className="border-neutral-100" />
          <DocumentParser document={message} />
        </div>
      </Card>
    </>
  );
};
