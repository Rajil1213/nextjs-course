import React from 'react';

import Link from 'next/link';

const ClientsPage = () => {
  return (
    <div>
      <h1>Welcome to the Clients Page</h1>
      <ul>
        {[1, 2, 3, 4, 5, 6].map((val) => {
          return (
            <li key={val}>
              <Link
                href={{
                  pathname: "clients/[id]",
                  query: { id: val }
                }}
              >
                Client {val}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ClientsPage;
