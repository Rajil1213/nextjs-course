import { PropsWithChildren } from "react";

import classes from "./errorAlert.module.css";

const ErrorAlert: React.FC<PropsWithChildren> = (props) => {
  return <div className={classes.alert}>{props.children}</div>;
};

export default ErrorAlert;
