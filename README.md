# Authentication

## Introduction

- Similar to React
- Authentication and Authorization

## How does Authentication Work in NextJS (and React)

- Client sends a request to the server with credentials
- The server responds with a “yes” or “no” depending upon whether the credentials are valid.
- For permissions, a “yes” or a “no” is not enough ⇒ we need some proof via:
  - Server-side sessions: store unique identifier on server, send some identifier to the client that the client sends to the server on subsequent requests
  - Authentication Tokens: server does not store permission token on server but sign it and send it to the client which it can verify when the client sends it with a request
- Typically for SPAs, we work with tokens because the pages are served directly and populated with logic without hitting the server
- Backend APIs work in a stateless way (they don’t care about connected clients)
- Here, we use JSON Web Token (JWT)
- It is a json signed with a key (that is stored only on the server)

## Using the `next-auth` package

- The course uses v3 but we will use the latest 😎
  [NextAuth.js](http://next-auth.js.org/)
- Migration guide for v3 to v4:
  [Upgrade Guide (v4) | NextAuth.js](https://next-auth.js.org/getting-started/upgrade-v4)
- Installation:
  ```tsx
  pnpm add next-auth
  ```
- Handles both the client-side and server-side authentication!

## Adding a User Sign Up API Route

- We’ll use a dummy file to mock the database
- For users, we use `data/users.json`
- We will use a service layer to talk to the db:
  ```tsx
  // src/services/db.ts
  import { existsSync, readFileSync, writeFileSync } from "fs";
  import path from "path";

  const buildPath = (collection: string) => {
    const filepath = path.join(process.cwd(), "db", collection + ".json");

    // if the file does not exist, create one with `[]` as the content
    if (!existsSync(filepath)) {
      console.log(filepath + " does not exist");
      writeFileSync(filepath, JSON.stringify([]));
    }

    return filepath;
  };

  export const find = (collection: string) => {
    const filepath = buildPath(collection);
    const contents = readFileSync(filepath);

    return JSON.parse(contents.toString());
  };

  export const insert = (collection: string, data: Record<string, unknown>) => {
    const contents = find(collection);
    const filepath = buildPath(collection);

    contents.push({ id: Date.now(), ...data });
    writeFileSync(filepath, JSON.stringify(contents));

    return data;
  };
  ```
- For this project, we will store the plaintext password:
  ```tsx
  // pages/api/signup.ts

  import { NextApiHandler } from "next";

  import { insert } from "@/services/db";

  const handler: NextApiHandler = (req, res) => {
    if (req.method !== "POST") return;

    const { email, password } = req.body;

    // validate
    if (!email || !email.includes("@") || !password || password.trim().lenght == 0) {
      res.status(422).json({ message: "Invalid Input" });
      return;
    }

    const result = insert("users", { email, password });
  };

  export default handler;
  ```
- We can also enforce uniqueness for the email address.
- For the purposes of this project, this is not really necessary.

## Adding the `Credentials Auth Provider` and User Login Logic

- There are special routes that are exposed by `next-auth`
- To access these, we use a slug: `/api/[...nextauth].ts`
  ```tsx
  import NextAuth, { NextAuthOptions } from "next-auth";
  import CredentialsProvider from "next-auth/providers/credentials";

  import { find } from "@/services/db";

  export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "email", type: "text" },
          password: { label: "password", type: "password" }
        },
        authorize(credentials) {
          if (!credentials) return null;
          const user = find("users").find(
            (user: { email: string; password: string }) =>
              user.email === credentials.email && user.password === credentials.password
          );

          if (!user) {
  					throw new Error("could not log you in");
  				}

          return user;
        }
      })
    ]
  });

  export default NextAuth(authOptions);
  ```

## Sending a Sign In Request From the Frontend

- We can use the `signIn` function from `next-auth/react`
- We must pass the credentials
- The passing of the sign in is determined by whether the `authorize` method defined above returns a valid object
- Any error thrown from `authorize` will be contained as the value of the `error` key returned by `signIn`'s promise:
  ```tsx

  ...
  import { signIn } from "next-auth/react";
  ...
  function AuthForm() {
    ...

    const submitHandler = async (e: React.SyntheticEvent) => {
      e.preventDefault();

      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!isLogin) {
        const result = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        const data = result.json();
        console.log(data);
      } else {
        const result = await signIn("credentials", { redirect: false, email, password });
        console.log(result);
      }
    };
  ;
  ```
- The `signIn` method never returns a rejected promise.

## Managing Active Sessions

- `next-auth` automatically sets cookies based on the authentication status
- We can check whether a valid token exists (for authenticated users) using the `useSession` function from `next-auth`
  ```tsx
  // components/mainNavigation.tsx

  import { useSession } from "next-auth/react";
  import Link from "next/link";

  import classes from "./mainNavigation.module.css";

  function MainNavigation() {
    const { data, status } = useSession();
    console.log(data);
    console.log(status);
  	...
  ```
  For the above to work, the layout has to be wrapped in `SessionProvider`:
  ```tsx
  // pages/__app.tsx
  ...
  export default function App({ Component, pageProps }: AppProps) {
    return (
      <SessionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    );
  }
  ```
- On the navigation bar, we can choose to show the `Profile` option only if the user is signed in:
  ```tsx
  return (
      <header className={classes.header}>
        <Link href="/">
          <div className={classes.logo}>Next Auth</div>
        </Link>
        <nav>
          <ul>
            {!data && status !== "loading" && (
              <li>
                <Link href="/auth">Login</Link>
              </li>
            )}
            {data && (
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            )}
  ...
  ```

## Adding User Logout

- We can simply use the `signOut` function from `next-auth`
  ```tsx

  import { signOut } from "next-auth/react";
  ...
  				{data && (
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
  	        )}
  ```

## Adding Client-Side Page Guards (protected routes)

- We can navigate to the `/auth` page if the user is not logged in and still visits the profile page:
  ```tsx
  const UserProfile: React.FC = () => {
    // Redirect away if NOT auth
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!data && status !== "loading") {
        router.push("/auth");
      }
    }, [data, status, router]);

    if (status === "loading") {
      return <p className={classes.profile}>Loading...</p>;
    }

    return (
      <section className={classes.profile}>
        <h1>Your User Profile</h1>
        <ProfileForm />
      </section>
    );
  };
  ```

## Adding Server-Side Guards (and when to use which)

- We can use server-side logic to check if the user is authenticated and send a pre-rendered page
- We must use the getServerSideProps since we need to determine the state on every request and not statically at build time
  ```tsx
  ...

  export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });

    if (!session) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false // only this time
        }
      };
    }

    return { props: { session } }; // can be used in the SessionProvider
  };

  export default ProfilePage;
  ```

## Protecting the `Auth` page

- We can simply go to the `/` page if the `data` exists:
  ```tsx
  const result = await signIn("credentials", { redirect: false, email, password });
  if (result && !result.error) {
    router.replace("/profile"); // redirect without adding to browser's history stack
  }
  console.log(result);
  ```
- With `replace`, if the user goes back a page, it takes the user to a page that is not the login page, effectively replacing the `/auth` route in the browser’s history.

## Changing Password

- We can also use `next-auth` in our api routes
- But to extract the session object, we need to use the `getServerSession()` function from `next-auth`:
  ```tsx
  import { NextApiHandler } from "next";
  import { getServerSession } from "next-auth";

  import { find, update } from "@/services/db";

  import { authOptions } from "../auth/[...nextauth]";

  const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "PATCH") return;

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      console.log(session);
      res.status(401).json({ message: "Not Authenticated" });
      return;
    }

    const user = session.user;
    if (!user) {
      res.status(401).json({ message: "Not Authenticated" });
      return;
    }

    const email = user.email;
    const userInDB = find("users").find((user: { email: string }) => user.email === email);

    if (!userInDB) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const oldPassword = JSON.parse(req.body).oldPassword;
    const newPassword = JSON.parse(req.body).newPassword;

    if (userInDB.password !== oldPassword) {
      res.status(422).json({ message: "wrong password" });
      return;
    }

    update("users", { email: userInDB.email, password: newPassword });
    res.status(201).json({ message: "password updated successfully" });
  };

  export default handler;
  ```
