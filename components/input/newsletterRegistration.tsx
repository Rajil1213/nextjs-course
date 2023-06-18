import { useRef } from "react";

import classes from "./newsletterRegistration.module.css";

const NewsletterRegistration: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const registrationHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    // fetch user input (state or refs)
    const email = emailRef.current?.value;

    ///// optional: validate input

    // send valid data to API
    const result = await fetch("/api/newsletter/register", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    const data = await result.json();

    console.log(data);
  };

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={emailRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
};

export default NewsletterRegistration;
