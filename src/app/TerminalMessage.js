"use client";
import styles from "./TerminalMessage.module.css";

export default function TerminalMessage({ msg }) {
  return (
    <p className="mt-2">
      <span className={styles["terminal-message"]}>SoTS</span>
      {msg}
    </p>
  );
}
