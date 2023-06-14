import React from "react";

import MainHeader from "./mainHeader";

const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <>
      <MainHeader />
      <main> {props.children}</main>
    </>
  );
};

export default Layout;
