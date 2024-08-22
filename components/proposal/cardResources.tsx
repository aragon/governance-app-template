import type { IProposalResource } from "@/utils/types";
import { Card, CardEmptyState, Heading, IconType, Link } from "@aragon/ods";
import React from "react";

interface ICardResourcesProps {
  displayLink?: boolean;
  resources?: IProposalResource[];
  title: string;
}

export const CardResources: React.FC<ICardResourcesProps> = (props) => {
  const { displayLink = true, title } = props;
  let { resources } = props;

  if (resources == null || resources.length === 0) {
    return <CardEmptyState objectIllustration={{ object: "ARCHIVE" }} heading="No resources were added" />;
  }

  // Check that resources is not a empty but not an array
  if (!Array.isArray(resources)) resources = [resources];

  return (
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
      <Heading size="h3">{title}</Heading>
      <div className="flex flex-col gap-y-4">
        {resources?.map((resource) => (
          <Link
            target="_blank"
            key={resource.url}
            href={resource.url}
            variant="primary"
            iconRight={displayLink ? IconType.LINK_EXTERNAL : undefined}
            description={displayLink ? resource.url : undefined}
          >
            {resource.name}
          </Link>
        ))}
      </div>
    </Card>
  );
};
