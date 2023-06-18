import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import classes from "./mainNavigation.module.css";

function MainNavigation() {
  const { data, status } = useSession();
  console.log(data);
  console.log(status);

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
          {data && (
            <li>
              <button onClick={() => signOut()}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
