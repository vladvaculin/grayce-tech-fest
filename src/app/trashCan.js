"use client";
import Image from "next/image";
import styles from "./AnimatedBackground.module.css";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import axios from "axios";

const getPrediction = async (image) => {
  const body = new FormData();
  body.append("file", image);
  console.log(...body);
  const res = await axios.post("http://127.0.0.1:5000/img", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res.data);
  return res.data;
};

export default function TrashCan({
  title,
  setImage,
  setCreateObjectURL,
  setGuess,
  setLoading,
  setPredictions,
  setError,
  correct,
  wrong,
  disabled = false,
}) {
  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setPredictions(null);
    setImage(acceptedFiles[0]);
    setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]));
    setGuess(title);
    // loading
    setLoading(true);
    // send to server
    // get pred
    console.log("loading...");
    try {
      const res = await getPrediction(acceptedFiles[0]);
      setPredictions(res["preds"]);
    } catch (e) {
      console.log(e);
      setError(true);
    }
    console.log("loaded");
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled,
  });
  return (
    <div
      onClick={(e) => {
        console.log(e);
      }}
    >
      <div
        {...getRootProps()}
        className={`flex flex-col cursor-pointer ${
          correct
            ? "outline-dotted outline-2 outline-offset-4 outline-lime-600/75 shadow-[0_0_27px_0_rgba(39,245,118,0.36)]"
            : ""
        } ${
          wrong
            ? "outline-dotted outline-2 outline-offset-4 outline-rose-500/75 shadow-[0_0_27px_0_rgba(244,63,94,0.36)]"
            : ""
        }`}
      >
        <input {...getInputProps()} />
        <Image
          src={`/${title}-lid.svg`}
          alt={`${title}-lid`}
          className={`dark:drop-shadow-[0_0_0.3rem_#ffffff70] ${
            styles["rotate-bl"]
          } ${isDragActive ? styles["rotate-bl-active"] : ""}`}
          width={150}
          height={24}
          priority
        />
        <Image
          src={`/${title}-body.png`}
          alt={`/${title}-body`}
          className={`dark:drop-shadow-[0_0_0.3rem_#ffffff70]`}
          width={150}
          height={24}
          priority
        />
      </div>
    </div>
  );
}
