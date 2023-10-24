import React, { useRef } from "react";
import "./App.css";
import Annotator from "./Annotator";
import { IAnnotTags } from "./Annotator/model/model";

function App() {
  const annotRef = useRef();
  const iantTagGroup = [
    {
      name: "Name1",
      placeHolder: "Select Name1",
      ianotTag: [
        { label: "class1", value: 1 },
        { label: "class2", value: 2 },
        { label: "class3", value: 3 },
        { label: "class4", value: 4 },
        { label: "class5", value: 5 }
      ]
    },
 
  ];

  return (
    <>
      <Annotator
        ref={annotRef}
        label=""
        images={[
          {
            url: "https://placekitten.com/408/285"
          },
          {
            url: "https://placekitten.com/307/215"
          }
        ]}
        width={1024}
        height={740}
        messageList={iantTagGroup}
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
