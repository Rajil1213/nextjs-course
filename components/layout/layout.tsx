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
