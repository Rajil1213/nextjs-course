# Notes

This branch contains notes for the Routing Module.

## Introduction

- From code-based to file-based
- Static and Dynamic Routes are possible

## File-based Routing

- Code-based routing involves coding up the routes in one (or more) files
- NextJS instead infers the routes from the folder structure through the special `/pages` directory
- For example:
  - `/pages`
    - `index.tsx` ⇒ starting page: `my-domain.com/`
    - `about.tsx` ⇒ `my-domain.com/about`
    - `/products`
      - `index.tsx` ⇒ `my-domain.com/products`
      - `[id].tsx` ⇒ `my-domain.com/products/1`

## Adding a First Page

- We can create files that acts as pages in the `pages` directory
  ```tsx
  // pages/index.tsx

  const HomePage = () => {
    return (
      <div>
        <h1>The Home Page</h1>
      </div>
    );
  };

  export default HomePage;
  ```
- The default export is necessary for the routing to work properly i.e, for Next to know what component to render

## Nested Paths

- To nest paths inside other paths, the parent path must be a directory within which we can created the nested paths.
- For example, for `/portfolio/list` route, we need a `porfolio` directory inside `pages` with a `list.tsx` file.

## Adding Dynamic Paths and Routes

- We use a special filename of the format: `[<placeholder>].tsx`
- The placeholder is replaced with a concrete value when a user actually accesses a route
- The concrete value can be extracted with the help of a hook called `useRouter` from `next/router`.
  ```tsx
  // src/pages/portfolio/[projectId].tsx

  import React from 'react';

  import { useRouter } from 'next/router';

  const PortfolioProject = () => {
    const router = useRouter();

    return (
      <div>
  			{// query is a special NodeJS.Dict }
        <h1>The Portfolio Project Page: {router.query.projectId}</h1>
      </div>
    );
  };

  export default PortfolioProject;
  ```
- We can also create nested dynamic routes
  ```tsx
  // src/pages/clients/[clientId]/clientProjectId].tsx

  import React from "react";

  import { useRouter } from "next/router";

  const ClientProjectId = () => {
    // make sure this is in PascalCase (eslint issue)
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
  ```

## Catch-All Routes

- For example, we want to read blogs from `2022/12` with the route `/2022/12/`
- For this, we create a file with the format: `[...slug].tsx`
- Example:
  ```tsx
  // pages/blog/[...slug].tsx

  import React from "react";

  import { useRouter } from "next/router";

  const BlogPostsPage = () => {
    const router = useRouter();
    return (
      <div>
        <h1>This is the Blog Posts Page: {JSON.stringify(router.query)}</h1>
        {/* {"slug":["2023","01"]} */}
      </div>
    );
  };

  export default BlogPostsPage;
  ```

## Navigating with the `Link` Component

- Use `Link` from `next/link`
- Example:
  ```tsx
  import Link from "next/link";

  const HomePage = () => {
    return (
      <div>
        <h1>The Home Page</h1>
        <ul>
          <li>
            <Link href="/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link href="/blog/2023/12">Blog</Link>
          </li>
          <li>
            <Link href="/clients">Clients</Link>
          </li>
        </ul>
      </div>
    );
  };

  export default HomePage;
  ```

## Navigating to Dynamic Routes

- This works just like React:
  ```tsx
  // pages/clients/index.tsx

  import React from "react";

  import Link from "next/link";

  const ClientsPage = () => {
    return (
      <div>
        <h1>Welcome to the Clients Page</h1>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((val) => {
            return (
              <li key={val}>
                <Link href={`clients/${val}`}>Client {val}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  export default ClientsPage;
  ```

## Passing an Object to the `href` prop

- The object takes the `pathname` (with the placeholder) and the `query` which holds an object with the concrete value:
  ```tsx
  {
    [1, 2, 3, 4, 5, 6].map((val) => {
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
    });
  }
  ```

#### Navigating Programmatically

- We can use the `push` method from the object returned by `useRouter()` to achieve programmatic routing
  ```tsx
  import React, { ChangeEvent, SyntheticEvent, useState } from "react";

  import { useRouter } from "next/router";

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
  ```

## Custom Error Page

- We can add our own custom error page by using a special file called `404.tsx` next to `_app.tsx`.
