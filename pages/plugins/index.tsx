import React, { useEffect, useState, FC } from 'react';
import { useRouter } from 'next/router';

const PluginLoader: FC = () => {
  const router = useRouter();
  const { pageName } = router.query;
  const [PageComponent, setPageComponent] = useState<FC | null>(null);

  useEffect(() => {
    if (typeof pageName === 'string') {
      import(`@/plugins/${pageName}/pages`)
        .then((mod) => setPageComponent(() => mod.default))
        .catch((err) => {
          console.error("Failed to load the page component", err);
          // Handle the error, maybe redirect to a 404 page or show an error message
        });
    }
  }, [pageName]);

  if (!PageComponent) return <div>Loading...</div>;

  return <PageComponent />;
};

export default PluginLoader;
