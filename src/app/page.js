"use client";

import Image from "next/image";
import { useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
// import { Great_Vibes, Cutive_Mono } from "next/font/google";
import { useDropzone } from "react-dropzone";
import styles from "./AnimatedBackground.module.css";
import TrashCan from "./trashCan";
import { Bar } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, BarElement } from "chart.js";
import TitleHeader from "./header";
import NeonButton from "./neonButton";
import TerminalMessage from "./TerminalMessage";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
// const font_gv = Great_Vibes({ weight: "400", subsets: ["latin"] });
// const font_cm = Cutive_Mono({ weight: "400", subsets: ["latin"] });

const CATEGORIES = [
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "general",
];
const getData = async () => {
  const res = await axios.post(
    "http://127.0.0.1:5000/img",
    {
      title: "sdfsdfdf",
    },
    {
      headers: [],
    }
  );
  console.log(res.data);
};
function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i];
    });
  });
}
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
export default function Home() {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [guess, setGuess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleUpload = (event) => {
    hiddenFileInput.current.click();
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      // console.log(i);
      setImage(i);

      setCreateObjectURL(URL.createObjectURL(i));

      setError(null);
      setGuess(null);

      setPredictions(null);
    }
  };

  const topPred = useMemo(() => {
    if (predictions === null) return null;
    // console.log(Object.keys(predictions));
    const topCat = zip([CATEGORIES, predictions]).reduce(
      (prevMax, curr) => {
        if (curr[1] > prevMax[1]) {
          return curr;
        }
        return prevMax;
      },
      ["", -1]
    );

    return topCat;
  }, [predictions]);

  const handleHelp = useCallback(async () => {
    if (!image) return;
    setError(null);
    setGuess(null);

    setPredictions(null);
    // loading
    setLoading(true);
    // send to server
    // get pred
    console.log("loading...");
    try {
      const res = await getPrediction(image);
      setPredictions(res["preds"]);
    } catch (e) {
      console.log(e);
      setError(true);
    }
    console.log("loaded");
    setLoading(false);
  }, [image]);
  return (
    <>
      <TitleHeader />
      <main className="flex flex-col items-center justify-between mt-8 p-24">
        <div className="flex justify-between items-center">
          <div
            className={`w-2/3 border-emerald-300 border-l-4 px-8 ${styles["glow-l"]}`}
          >
            <h2 className="text-3xl mb-4 text-emerald-300">
              Dispose Your Waste Correctly!
            </h2>
            <p>
              The Seek-O-Tron Salvager is an image classification model
              developed to assess images of waste and assign the correct
              recycling bin categories in which the waste should be disposed.
            </p>
          </div>
          <div className="mr-auto ml-auto">
            <Image
              src="/recycling.svg"
              alt="recycle"
              width={200}
              height={300}
              priority
            />
          </div>
        </div>
        <div className="mt-12 flex relative w-full">
          <div className="w-1/3 flex flex-col pr-4">
            <div className="flex flex-col">
              <label>1. Select an image</label>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={uploadToClient}
                accept="image/*"
                style={{ display: "none" }}
              />
              <NeonButton className="mt-2 w-60" onClick={handleUpload}>
                Upload Image
              </NeonButton>
            </div>
            {image ? (
              <div className="flex flex-col mt-6">
                <label>
                  2. You can either drag and drop the image to a bin or be lazy
                  and trust Seek-O-Tron
                </label>
                <NeonButton className="mt-2 w-60" onClick={handleHelp}>
                  Ask for help!
                </NeonButton>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="w-1/3">
            <div
              style={{
                height: 300,
                boxShadow:
                  "-4px 5px 11px 4px rgb(99 102 241 / 0.25), 6px -6px 6px -3px rgb(99 102 241 / 0.25)",
              }}
              className="p-2"
            >
              <div className="relative flex justify-center items-center h-full w-full">
                <Image
                  src={createObjectURL || "/add-trash.svg"}
                  alt="add image"
                  // width={150}
                  // height={300}
                  className={createObjectURL ? "" : "opacity-50"}
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </div>
          </div>
          <div
            className={`w-1/3 border-emerald-300 border-r-4 px-8 text-right ${styles["glow-r"]}`}
          >
            <h3 className="text-xl mb-4 text-emerald-300">How to use</h3>
            <p>
              Drag and drop a picture of the waste in one of the bins that you
              think it should go in.
            </p>
            <p className="mt-2">
              Alternatively, follow the steps on the left-hand side.
            </p>
            <p>Once the image is uploaded, you will see it in the middle.</p>
            <p className="mt-2">
              Seek-O-Tron Salvager will give you his verdict in the terminal
              below. You can also peek inside his brain!
            </p>
          </div>
        </div>
        <div
          className="mt-6 border w-full"
          style={{
            background: "#1E1E1E88",
          }}
        >
          <div
            className="w-full bg-slate-800/25 px-4 flex items-center"
            style={{ height: 40 }}
          >
            <span
              style={{
                height: 16,
                width: 16,
                background: "#FF5F56",
                borderRadius: "50%",
                display: "inline-block",
              }}
            ></span>
            <span
              style={{
                height: 16,
                width: 16,
                background: "#FFBD2E",
                borderRadius: "50%",
                display: "inline-block",
                marginLeft: 10,
              }}
            ></span>
            <span
              style={{
                height: 16,
                width: 16,
                background: "#27C93F",
                borderRadius: "50%",
                display: "inline-block",
                marginLeft: 10,
              }}
            ></span>
          </div>
          <div className="w-full flex justify-between ">
            <Image
              src={"/dalle-rob.png"}
              alt="dalle image"
              width={350}
              height={300}
              priority
            />
            <div className={`p-4 font-cm mr-auto`}>
              {guess ? (
                <TerminalMessage
                  msg={`so you think this should go in the ${guess} bin`}
                />
              ) : (
                <></>
              )}
              {error ? (
                <p className="italic">* Seek-O-Tron crashed (x_x) *</p>
              ) : (
                <></>
              )}

              {loading ? (
                <TerminalMessage msg={`Let me think...`} />
              ) : predictions ? (
                <TerminalMessage
                  msg={`I am ${Math.round(
                    topPred[1] * 100
                  )}% sure this should go in the ${topPred[0]} bin`}
                />
              ) : (
                <></>
              )}
              {guess && topPred ? (
                <TerminalMessage
                  msg={`Verdict: ${
                    guess === topPred[0]
                      ? "I'm proud of you"
                      : "maybe you'll get it next time"
                  }`}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="p-4">
              {predictions ? (
                <Bar
                  data={{
                    labels: CATEGORIES,
                    datasets: [
                      {
                        label: "conf",
                        data: predictions,
                        backgroundColor: "darkcyan",
                      },
                    ],
                  }}
                  options={{
                    indexAxis: "y",
                  }}
                  height={300}
                  width={400}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className={`w-full shadow-lg shadow-indigo-500/25 mt-12 p-1`}>
          <div className="flex items-center justify-between">
            {CATEGORIES.map((cat, i) => (
              <TrashCan
                key={i}
                title={cat}
                setImage={setImage}
                setCreateObjectURL={setCreateObjectURL}
                setGuess={setGuess}
                setLoading={setLoading}
                setPredictions={setPredictions}
                setError={setError}
                correct={topPred && cat === topPred[0]}
                wrong={
                  guess && topPred && cat === guess && guess !== topPred[0]
                }
              />
            ))}
          </div>
        </div>
        <div className="z-10 mt-12 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            By Dagmara, Girogia, and Vlad
          </p>
          <div className="flex place-items-center gap-2">
            The <span className="text-emerald-500 font-bold">Green</span>
            <Image
              src="/goblin.svg"
              alt="goblins"
              width={30}
              height={30}
              priority
            />
            Team
          </div>
        </div>
      </main>
    </>
  );
}
