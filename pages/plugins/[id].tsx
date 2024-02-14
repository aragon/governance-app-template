import React, { useEffect, useState, FC } from "react";
import { useRouter } from "next/router";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { resolveQueryParam } from "@/utils/query";
import { NotFound } from "@/components/not-found";

const PluginLoader: FC = () => {
  const { query, push } = useRouter();
  const pluginId = resolveQueryParam(query.id);
  const [PageComponent, setPageComponent] = useState<FC | null>(null);
  const [showNotFoundError, setShowNotFoundError] = useState(false);

  useEffect(() => {
    if (!pluginId || typeof pluginId !== "string") {
      // Redirect to the home page
      push("/");
      return;
    }

    import(`@/plugins/${pluginId}`)
      .then((mod) => {
        setShowNotFoundError(false);
        setPageComponent(() => mod.default);
      })
      .catch((err) => {
        console.error("Failed to load the page component", err);

        setShowNotFoundError(true);
      });
  }, [pluginId]);

  if (showNotFoundError) {
    return <NotFound />;
  } else if (!PageComponent) {
    return (
      <div>
        <PleaseWaitSpinner />
      </div>
    );
  }

  return <PageComponent />;
};

export default PluginLoader;
