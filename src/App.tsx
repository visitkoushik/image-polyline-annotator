import React from "react";
import "./App.css";
import Annotator from "./Annotator/reactimageannotator";
import { IMessage } from "./Annotator/model/model";

function App() {
  const imsg  = [
    { label: "class1", value: 1 },
    { label: "class2", value: 2 },
    { label: "class3", value: 3 },
    { label: "class4", value: 4 },
    { label: "class5", value: 5 }
  ];

  return (
    <Annotator
      images={[
        {
          url: "https://placekitten.com/408/285",
          width: "60vw",
          height: "60vh"
        }
      ]}

      messageList={imsg}
    />
  );
}

export default App;
