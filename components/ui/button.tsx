import React, { MouseEvent } from "react";

import Link from "next/link";

import classes from "./button.module.css";

type ButtonProps =
  | {
      onClick: (e: MouseEvent<HTMLButtonElement>) => void;
      link?: never;
    }
  | {
      link: string;
      onClick?: never;
    };

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  if (props.onClick) {
    return (
      <button className={classes.btn} onClick={props.onClick}>
        {props.children}
      </button>
    );
  }
  return (
    <Link href={props.link} className={classes.btn}>
      {props.children}
    </Link>
  );
};

export default Button;
