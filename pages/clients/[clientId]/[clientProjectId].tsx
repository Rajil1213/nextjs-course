import React from 'react';

import { useRouter } from 'next/router';

const ClientProjectId = () => {
  const router = useRouter();

  return (
    <div>
      <h1>
        This is the page for client {router.query.clientId}&apos;s project{" "}
        {router.query.clientProjectId}
      </h1>
    </div>
  );
};

export default ClientProjectId;
