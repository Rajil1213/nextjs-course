import React from 'react';

import { useRouter } from 'next/router';

const PortfolioProject = () => {
  const router = useRouter();

  return (
    <div>
      <h1>The Portfolio Project Page: {router.query.projectId}</h1>
    </div>
  );
};

export default PortfolioProject;
