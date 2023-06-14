import React, {
  ChangeEvent,
  SyntheticEvent,
  useState,
} from 'react';

import { useRouter } from 'next/router';

const ClientID = () => {
  const router = useRouter();
  const clientId = router.query.clientId;
  const [projectId, setProjectId] = useState<string>("");

  const loadProjectHandler = (e: SyntheticEvent) => {
    e.preventDefault();

    if (projectId.length === 0) return;
    if (!clientId) return;

    router.push({
      pathname: "/clients/[clientId]/[clientProjectId]",
      query: { clientId, clientProjectId: projectId }
    });
  };

  return (
    <div>
      <h1>This is the page for client {router.query.clientId}</h1>
      <hr />
      <h1> Projects </h1>
      <form onSubmit={loadProjectHandler}>
        <h1>
          <input
            type="number"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectId(e.target.value)}
            placeholder="Enter Project ID"
          />
        </h1>
        <button>Load</button>
      </form>
    </div>
  );
};

export default ClientID;
