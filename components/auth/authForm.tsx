import { useRef, useState } from "react";

import { signIn } from "next-auth/react";

import classes from "./authForm.module.css";

function AuthForm() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

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

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          <button type="submit">{isLogin ? "Login" : "Create Account"}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
