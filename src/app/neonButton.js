"use client";
import styles from "./NeonButton.module.css";

export default function NeonButton(props) {
  const { children, className, ...rest } = props;
  const classes = className
    ? styles["neon-button"] + " " + className
    : styles["neon-button"];
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
