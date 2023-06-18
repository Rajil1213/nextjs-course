# React Context

## Introduction

- Show notifications with React Context for HTTP requests status

## The Store

- We can create React Context store:
  ```tsx
  // store/notificationContext.tsx

  import React, { PropsWithChildren, useState } from "react";

  export interface NotificationData {
    title: string;
    message: string;
    status: "success" | "error" | "pending";
  }

  const NotificationContext = React.createContext({
    notification: { title: "", message: "", status: "error" } as NotificationData | null,
    showNotification: function (notificationData: NotificationData) {},
    hideNotification: function () {}
  });

  // create provider to wrap other components where we want access to the context object
  export const NotificationContextProvider: React.FC<PropsWithChildren> = (props) => {
    const [notification, setNotifcation] = useState<NotificationData | null>(null);

    const showNotificationHandler = (notificationData: NotificationData) => {
      setNotifcation(notificationData);
    };

    const hideNotificationHandler = () => {
      setNotifcation(null);
    };

    const context = {
      notification: notification,
      showNotification: showNotificationHandler,
      hideNotification: hideNotificationHandler
    };

    return (
      <NotificationContext.Provider value={context}>{props.children}</NotificationContext.Provider>
    );
  };

  export default NotificationContext;
  ```
- We can then, use it in our app:
  ```tsx
  export default function App({ Component, pageProps }: AppProps) {
    return (
      <NotificationContextProvider>
        <Layout>
          <Head>
            <title>NextJS Events</title>
            <meta name="description" content="Find the most exciting events near you" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          <Component {...pageProps} />
          <Notification title="Test" message="Test" status="success" />
        </Layout>
      </NotificationContextProvider>
    );
  }
  ```
- Note that the store will only be available in components **under** App but not the `App` component itself.
- For example, we can use it in the `Layout` component:
  ```tsx
  import React, { useContext } from "react";

  import NotificationContext from "@/store/notificationContext";

  import Notification from "../notification/notification";
  import MainHeader from "./mainHeader";

  const Layout: React.FC<React.PropsWithChildren> = (props) => {
    const notificationContext = useContext(NotificationContext);
    const notification = notificationContext.notification;

    return (
      <>
        <MainHeader />
        <main> {props.children}</main>
        {notification && (
          <Notification
            message={notification.message}
            title={notification.title}
            status={notification.status}
          />
        )}
      </>
    );
  };

  export default Layout;
  ```

## Triggering Notification

- We can trigger a pending notification while a user signs up to our newsletter and then, show success when the signing up is done
- To mimic a real HTTP request with delays, we will use `setTimeout`:
  ```tsx
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
  ```

## Removing Notifications Automatically

- We want to remove a `success` or `error` notifications automatically, say after 3 seconds
- We can use a timeout in the `Notification` component itself that is also part of the `Layout` component and is inside the `Provider`. Or, we can use a click to hide the notification.
  ```tsx
  const Notification: React.FC<NotificationData> = (props) => {
    const notificationCtx = useContext(NotificationContext);
    const { title, message, status } = props;

    let statusClasses = "";

    if (status === "success") {
      statusClasses = classes.success;
    }

    if (status === "error") {
      statusClasses = classes.error;
    }

    if (status === "pending") {
      statusClasses = classes.pending;
    }

    setTimeout(() => {
      if (status === "pending") return;
      notificationCtx.hideNotification();
    }, 5000);

    const activeClasses = `${classes.notification} ${statusClasses}`;

    return (
      <div className={activeClasses} onClick={() => notificationCtx.hideNotification()}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    );
  };

  export default Notification;
  ```
- Alternatively, we can clear the timer in the notification context provider itself:
  ```tsx
  export const NotificationContextProvider: React.FC<PropsWithChildren> = (props) => {
    const [notification, setNotifcation] = useState<NotificationData | null>(null);

    useEffect(() => {
      if (!notification || notification.status === "pending") return;

      const timer = setTimeout(() => {
        hideNotificationHandler();
      }, 5000);

      // unmount to remove multiple timers
      return () => {
        clearTimeout(timer);
      };
    }, [notification]);
  ```
- We can have a similar implementation for comments.
