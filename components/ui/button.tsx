import React from 'react';

import Link from 'next/link';

import classes from './button.module.css';

interface ButtonProps {
  link: string;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({ link, children }) => {
  return (
    <Link href={link} className={classes.btn}>
      {children}
    </Link>
  );
};

export default Button;
