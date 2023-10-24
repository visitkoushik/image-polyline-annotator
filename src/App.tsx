import React, { useRef } from "react";
import "./App.css";
import Annotator from "./Annotator";
import { IMessage } from "./Annotator/model/model";

function App() {
  const annotRef = useRef();
  const imsg = [
    { label: "class1", value: 1 },
    { label: "class2", value: 2 },
    { label: "class3", value: 3 },
    { label: "class4", value: 4 },
    { label: "class5", value: 5 }
  ];

  return (
    <>
    
      <Annotator
        ref={annotRef}
        images={[
          {
            url: "https://placekitten.com/408/285",
            regions: [
              {
                type: "Rectangle",
                fill: "rgba(255,0,0,0.25)",
                color: "rgba(255,0,0,0.75)",
                strokeWidth: "2",
                points:
                  "0.11304347826086956 0.24933333333333332 0.11304347826086956 0.372 0.1826086956521739 0.372 0.1826086956521739 0.24933333333333332 0.11304347826086956 0.24933333333333332",
                inEditmode: false,
                pix: {
                  x: 1150,
                  y: 750
                },

                id: "1698008259158",
                msg: {
                  label: "class3",
                  value: 3
                }
              },
              {
                type: "Polygon",
                fill: "rgba(255,0,0,0.25)",
                color: "rgba(255,0,0,0.75)",
                strokeWidth: "2",
                points:
                  "0.6217391304347826 0.11333333333333333 0.7704347826086957 0.32266666666666666 0.5721739130434783 0.5426666666666666 0.49826086956521737 0.3413333333333333 0.6217391304347826 0.11333333333333333",
                inEditmode: false,
                pix: {
                  x: 1150,
                  y: 750
                },

                id: "1698008274930",
                msg: {
                  label: "class5",
                  value: 5
                }
              },
              {
                type: "Rectangle",
                fill: "rgba(255,0,0,0.25)",
                color: "rgba(255,0,0,0.75)",
                strokeWidth: "2",
                points:
                  "0.2182608695652174 0.44666666666666666 0.2182608695652174 0.6333333333333333 0.3565217391304348 0.6333333333333333 0.3565217391304348 0.44666666666666666 0.2182608695652174 0.44666666666666666",
                inEditmode: false,
                pix: {
                  x: 1150,
                  y: 750
                },

                id: "1698008287721",
                msg: {
                  label: "class2",
                  value: 2
                }
              },
              {
                type: "Polygon",
                fill: "rgba(255,0,0,0.25)",
                color: "rgba(255,0,0,0.75)",
                strokeWidth: "2",
                points:
                  "0.21913043478260869 0.12133333333333333 0.27391304347826084 0.21333333333333335 0.19478260869565217 0.2733333333333333 0.21913043478260869 0.12133333333333333",
                inEditmode: false,
                pix: {
                  x: 1150,
                  y: 750
                },

                id: "1698008332533",
                msg: {
                  label: "class4",
                  value: 4
                }
              },
              {
                type: "Rectangle",
                fill: "rgba(255,0,0,0.25)",
                color: "rgba(255,0,0,0.75)",
                strokeWidth: "2",
                points:
                  "0.802608695652174 0.10666666666666667 0.802608695652174 0.184 0.851304347826087 0.184 0.851304347826087 0.10666666666666667 0.802608695652174 0.10666666666666667",
                inEditmode: false,
                pix: {
                  x: 1150,
                  y: 750
                },

                id: "1698008348552",
                msg: {
                  label: "class4",
                  value: 4
                }
              }
            ]
          },
          {
            url: "https://placekitten.com/307/215",
            name: "Mao"
          }
        ]}
        width={1200}
        height={800}
        messageList={imsg}
        onSave={(e: any) => {
          console.log(e);
        }}
      />
      <button
        onClick={() => {
          if (annotRef?.current) {
            //@ts-ignore
            annotRef.current.onSave();
          }
        }}
      >
        Save
      </button>
    </>
  );
}

export default App;
