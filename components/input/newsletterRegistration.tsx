import { useContext, useRef } from "react";

import NotificationContext from "@/store/notificationContext";

import classes from "./newsletterRegistration.module.css";

const NewsletterRegistration: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const context = useContext(NotificationContext);

  const registrationHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    // fetch user input (state or refs)
    const email = emailRef.current?.value;

    context.showNotification({
      title: "Signing up...",
      message: "Registering you to our newsletter",
      status: "pending"
    });

    // send valid data to API
    setTimeout(async () => {
      const result = await fetch("/api/newsletter/register", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      if (!result.ok) {
        context.showNotification({
          title: "Signed up failed",
          message: "We could not register you to our newsletter",
          status: "success"
        });
        return;
      }
      const data = await result.json();

      console.log(data);
      if (data) {
        context.showNotification({
          title: "Signed up successfully",
          message: "You are registered to our newsletter",
          status: "success"
        });
      }
    }, 2000);
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
