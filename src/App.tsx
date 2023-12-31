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
    {
      name: "Name2",
      placeHolder: "Select Name2",
      ianotTag: [
       
        { label: "class4", value: 4 },
        { label: "class5", value: 5 },
        { label: "class6", value: 6 }
      ]
    },{
      name: "Name3",
      placeHolder: "Select Name3",
      ianotTag: [
       
        { label: "class1", value: 1 },
        { label: "class2", value: 2 },
        { label: "class3", value: 3 }
      ]
    },
  ];

  return (
    <>
    
      <Annotator
        ref={annotRef}
 
        images={[
          {
            url: "https://placekitten.com/408/285",
          },
          {
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU3B1oC3fGIsL1den7eEUmPl8HLk_-mVDTowvovao4_3Gv4-OaLkAcIhrMqcfzj06ZHek&usqp=CAU",
          },
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
