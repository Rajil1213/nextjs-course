# Page Pre-Rendering & Data Fetching

# Notes

## Introduction

- What is data fetching and how does NextJS enables its?
- Full stack capabilities

## The Problem with Traditional React Apps (and Data Fetching)

- The React page source code does not really have anything
- Rendering is done completely on the Client Side with JavaScript
- Actual HTML served by the server has no data
- The user has to wait for the data.
- More importantly, SEO does not take place because the page is virtually empty. This is specially bad if the page is public-facing!

## How NextJS Prepares and Pre-renders Pages

- Next returns a pre-rendered page (fully rendered HTML) instead of relying JS execution on the client
- We still want the page to be interactive. So, Next will also send back all the ReactJS code required for the interaction (hydration)
- `Request` ⇒ `/route` ⇒ `return pre-rendered page` ⇒ `hydrate with react code once loaded` ⇒ `page and app becomes interactive`
- Two forms of pre-rendering:
  - Static Generation (recommended)
    - All pages are pre-generated in advance during build time
  - Server-side Rendering
    - Pages are created just-in-time when the request reaches the server

## Static Generation (with `getStaticProps`)

- Pre-regenerate a page (with data prepared on the server-side) during build time
- Pages are prepared ahead of time and can be cached by the server/CDN serving the app
- We use a special async function named exactly `getStaticProps(context)` that NextJS watches out for.
- The code inside this function is never exposed on the client side
- NextJS pre-renders components with no dynamic data such as:
  ```tsx
  const HomePage = () => {
    return (
      <ul>
        <li>Product 1</li>
        <li>Product 2</li>
        <li>Product 3</li>
      </ul>
    );
  };

  export default HomePage;
  ```

#### `getStaticProps`

- Can be added to any page file
- This function needs to be exported and NextJS calls this function on our behalf
- This function must always return an object with a `props` key that is passed to the component:
  ```tsx
  import { GetStaticProps } from "next";

  type ProductInfo = {
    id: string;
    title: string;
  };

  interface ProductInfoProps {
    products: Array<ProductInfo>;
  }

  const HomePage: React.FC<ProductInfoProps> = ({ products }) => {
    return (
      <ul>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    );
  };

  // this is executed first
  // and the props are passed to the `HomePage` component
  export const getStaticProps: GetStaticProps<ProductInfoProps> = async () => {
    return {
      props: {
        products: [
          { id: "p1", title: "Product 1" },
          { id: "p2", title: "Product 2" },
          { id: "p3", title: "Product 3" }
        ]
      }
    };
  };

  export default HomePage;
  ```

#### Running Server Side Code and Using the Filesystem

- Loading data from a data file say, `data/dummy-data.json`
- All the code inside the `getStaticProps` is executed on the server side
- Imports that are only used in this server side code are stripped from the client-side bundle
  ```tsx
  import data from '@/data/dummy-backend.json';
  ...

  export const getStaticProps: GetStaticProps<ProductInfoProps> = async () => {
    return {
      props: {
        products: data.products
      }
    };
  };

  ...
  ```

#### A Look Behind the Scenes

- When we build the Next Application, we get the following (sample) output:
  ```tsx
  ╰─ pnpm build

  > nextjs-course@0.1.0 build /Users/rajil/courses/nextjs/nextjs-course
  > next build

  - info Linting and checking validity of types
  - info Creating an optimized production build
  - info Compiled successfully
  - info Collecting page data
  - info Generating static pages (3/3)
  - info Finalizing page optimization

  Route (pages)                              Size     First Load JS
  ┌ ● /                                      319 B          74.2 kB
  ├   /_app                                  0 B            73.9 kB
  └ ○ /404                                   182 B          74.1 kB
  + First Load JS shared by all              74.1 kB
    ├ chunks/framework-1b4fc531f06a7f60.js   45.2 kB
    ├ chunks/main-cde4743fc70e9fbf.js        27.6 kB
    ├ chunks/pages/_app-d156c0d28703eb6f.js  298 B
    ├ chunks/webpack-8fa1640cc84ba8fe.js     750 B
    └ css/49861c0d8668ac82.css               185 B

  ○  (Static)  automatically rendered as static HTML (uses no initial props)
  ●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
  ```
- Under the `Route` section, we see our pages/routes marked with dots that have their own meanings
- These meanings are shown at the bottom.
- The non-filled dot represents static pages that have no props and are rendered statically
- The filled dot represents pages that are dependent on some data (via the `getStaticProps`)
- We can view these pages in the `.next/server` that holds the production-ready pages.

#### Utilizing Incremental Static Generation (ISR)

- What if the data is dynamic and changes frequently?
- Re-building and re-deploying is not feasible every time the data changes.
- We can use `useEffect()` to fetch the updated data in the background.
- But we don’t need to do this!
- We can tell Next to re-run the `getStaticProps` function on every request, at most every X seconds.
- The regenerated page is cached until the timeout value set.
- We use the `revalidate` key:
  ```tsx
  export const getStaticProps: GetStaticProps<ProductInfoProps> = async () => {
    return {
      props: {
        products: data.products
      },
      revalidate: 20; // seconds
    };
  };
  ```
- In the development server, the regeneration happens every second
- In the production server, the revalidate value is taken into account.
- When we build with the above config, we now see:
  ```tsx
  ┌ ● / (ISR: 20 Seconds)                    319 B          74.2 kB
  ├   /_app                                  0 B            73.9 kB
  └ ○ /404                                   182 B          74.1 kB
  + First Load JS shared by all              74.1 kB
    ├ chunks/framework-1b4fc531f06a7f60.js   45.2 kB
    ├ chunks/main-cde4743fc70e9fbf.js        27.6 kB
    ├ chunks/pages/_app-d156c0d28703eb6f.js  298 B
    ├ chunks/webpack-8fa1640cc84ba8fe.js     750 B
    └ css/49861c0d8668ac82.css               185 B

  ○  (Static)  automatically rendered as static HTML (uses no initial props)
  ●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
     (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
  ```
  In the console, when we use `pnpm start`, we see `Re-generating` logs every 20 seconds upon request.

#### The config

- The `GetStaticProps` function takes many keys:
- There is a `notFound` option that can be set to `true`:
  ```tsx
  if (data.products.length == 0) return { notFound: true };
  ```
- We can also redirect:
  ```tsx
  if (!data) {
  	return {
  		redirect: {
  			destination: "/"
  		}
  }
  ```

#### Working with Dynamic Pages

- We can extract the concrete path from the `params` object inside the `context` object that the `getStaticProps` function accepts:
  ```tsx
  interface ProductDetailPageProps {
    productInfo?: ProductInfo | undefined;
  }

  export const getStaticProps: GetStaticProps<ProductDetailPageProps> = async (context) => {
    const { params } = context;
    if (!params)
      return {
        redirect: { destination: "/", permanent: false },
        props: {}
      };

    const productId = params.pid;
    const product = data.products.find((product) => product.id === productId);

    if (!product) return { notFound: true, props: {} };

    return {
      props: {
        productInfo: product
      }
    };
  };
  ```
- NextJS does **not** pre-generate dynamic pages because these pages can have _any_ number of actual content depending upon the param value
- So, we must provide NextJS with some more information such as:
  - which dynamic values will be available
- For this, we use the `getStaticPaths` function

#### `getStaticPaths`

- Defines which concrete values to pre generate dynamic pages for
  ```tsx
  export const getStaticPaths: GetStaticPaths = () => {
    const preloadIds = data.products.map((product) => ({ params: { pid: product.id } }));

    return {
      paths: preloadIds,
      fallback: true
    };
  };
  ```
- When we build with this config, we get:
  ```tsx
  Route (pages)                              Size     First Load JS
  ┌ ● / (ISR: 20 Seconds)                    2.61 kB        76.5 kB
  ├   /_app                                  0 B            73.9 kB
  ├ ● /[pid]                                 337 B          74.2 kB
  ├   ├ /p1
  ├   ├ /p2
  ├   └ /p3
  └ ○ /404                                   182 B          74.1 kB
  + First Load JS shared by all              74.1 kB
    ├ chunks/framework-ac88a2a245aea9ab.js   45.2 kB
    ├ chunks/main-cde4743fc70e9fbf.js        27.6 kB
    ├ chunks/pages/_app-d156c0d28703eb6f.js  298 B
    ├ chunks/webpack-8fa1640cc84ba8fe.js     750 B
    └ css/49861c0d8668ac82.css               185 B

  ○  (Static)  automatically rendered as static HTML (uses no initial props)
  ●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
     (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
  ```
  As we can see, the `p{1..3}` routes are statically generated.
- NextJS performs one more level of optimization i.e., the data for `p{1..3}` are pre-fetched even when we just visit `/` route where the links to the `p{1..3` pages exist (see `Network` tab) for details.

#### The `fallback` key

- If we have a lot of pages that need to be pre generated, this can take super long.
- Value: `true`
  - We can choose to generate only some pages if we set the `fallback` value to `true`.
    - With fallback set to `true`, other routes are also generated but just in time when the request is received.
  - However, there is a possibility that our component now receives an undefined prop (as it might not have been generated when the request arrived).
  - So, we must create a fallback logic in our component for the case when the props are undefined.
    ```tsx
    const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productInfo }) => {
      if (!productInfo) return <p>Loading...</p>;

      return (
        <>
          <h1>{productInfo.title}</h1>
          <p>{productInfo.description}</p>
        </>
      );
    };

    ...
    export const getStaticPaths: GetStaticPaths = () => {
      return {
    		// generate p2 just in time
        paths: [{ params: { pid: "p1" } }, { params: { pid: "p3" } }],
        fallback: true
      };
    };
    ```
- Value: `"blocking"`
  - Wait for the page to load

## Server-side Rendering

#### Introduction

- For static generation, there is no access to the actual incoming request
- Sometimes, we need “real” server-side rendering per request (for example, extracting cookies)
- We use the `getServerSideProps()`

#### `getServerSideProps`

- Almost exactly like `getStaticProps` but without the `revalidate` key because it is run at every request.
  ```tsx
  import React from "react";

  import { GetServerSideProps } from "next";

  interface UserProfileProps {
    username: string;
  }

  const UserProfile: React.FC<UserProfileProps> = (props) => {
    return <h1>{props.username}</h1>;
  };

  export const getServerSideProps: GetServerSideProps<UserProfileProps> = async () => {
    return {
      props: {
        username: "Rajil"
      }
    };
  };

  export default UserProfile;
  ```

#### `Context`

- We have access to the full request object via the request object
  ```tsx
  const { req, res, params } = context;
  ```
- These are Node request and response objects:
  [https://nodejs.org/api/http.html##http_class_http_incomingmessage](https://nodejs.org/api/http.html##http_class_http_incomingmessage)
  [https://nodejs.org/api/http.html##http_class_http_serverresponse](https://nodejs.org/api/http.html##http_class_http_serverresponse)

#### Dynamic Pages and `getServerSideProps`

- As the function runs on every request and the page is not pre-rendered, we have access to the concrete `params` object and can extract the concrete value from there:
  ```tsx
  interface UserIdProps {
    uid: string;
  }

  const UserId: React.FC<UserIdProps> = (props) => {
    return <div>User With ID: {props.uid}</div>;
  };

  export const getServerSideProps: GetServerSideProps<UserIdProps> = async (context) => {
    const { params } = context;
    const emptyRes = { props: { uid: "" } };

    if (!params) return emptyRes;

    const uid = params.uid;

    if (typeof uid !== "string") return emptyRes;

    return {
      props: {
        uid: uid
      }
    };
  };

  export default UserId;
  ```

<aside>
💡 `getServerSideProps` and `getStaticProps` cannot be used together on the same page

</aside>

## Client-side Data Fetching

#### When to Use it?

- Sometimes we need the latest data, for example:
  - highly dynamic data such as for stock data
  - user-specific data such as last orders on an e-commerce site.
  - partial data is enough such as in a large datatable

#### Implementation

- Use `useEffect` to fetch data

#### Using `useSWR`

[http://swr.vercel.app](http://swr.vercel.app)

- `stale-while-revalidate`
- Prefer `react-query`

#### Combining Pre-fetching with Client-side Fetching

- We can use `getStaticProps` or `getServerSideProps` to pre generate the page and then, reload with new data upon request.
- We pass the props to set the state for the page we want to pre-render
- Inside `useEffect()`, we can then update the state with the fetched data.
