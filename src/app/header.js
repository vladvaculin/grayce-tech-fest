"use client";
import Image from "next/image";
import styles from "./AnimatedBackground.module.css";

export default function TitleHeader({}) {
  return (
    <div className="h-60 mt-32 w-2/3 mx-auto">
      <div className={styles["title-border"]}>
        <div className={styles["title-top"]}>
          <div className="flex flex-col justify-center items-center pt-4">
            <Image
              src="/grayce_logo.png"
              alt="Grayce Logo"
              className=""
              width={150}
              height={24}
              priority
            />
            <span
              className={`font-gv text-4xl px-4 leading-loose bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 ${styles["background-animate"]}`}
            >
              Tech Fest
            </span>
          </div>
        </div>
        <div className="mx-auto font-js ">
          <h1 className={`text-8xl text-center ${styles["title-header"]}`}>
            Seek-<span className={styles["title-letter-blink"]}>O</span>-Tron
            Salvager
          </h1>
        </div>
      </div>
    </div>
  );
}
