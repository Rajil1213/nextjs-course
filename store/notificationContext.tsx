import React, { PropsWithChildren, useEffect, useState } from "react";

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

export const NotificationContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [notification, setNotifcation] = useState<NotificationData | null>(null);

  useEffect(() => {
    if (!notification || notification.status === "pending") return;

    const timer = setTimeout(() => {
      hideNotificationHandler();
    }, 5000);

    // unmount
    return () => {
      clearTimeout(timer);
    };
  }, [notification]);

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
