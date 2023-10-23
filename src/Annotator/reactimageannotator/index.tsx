import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import MainLayout from "../mainlayout";
import { IAnnotator } from "../model/model";

const Annotator = forwardRef((props: IAnnotator, ref) => {
  const HW_SIZE = 50;
  const mainRef = useRef(null);
  const annoteEvents = useRef(null);

  useImperativeHandle(ref, () => ({
    onSave: () => {
      if (mainRef?.current) {
        if (props.onSave) {
          //@ts-ignore
          props.onSave(mainRef.current.saveRegionList());
        }
      }
    },
    selectPolly: () => {
      if (mainRef?.current) {
        //@ts-ignore
        mainRef.current.setDrawModePolly();
      }
    },
    selectRect: () => {
      if (mainRef?.current) {
        //@ts-ignore
        mainRef.current.setDrawModeRect();
      }
    }
  }));

  return (
    <div ref={annoteEvents}>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: `${HW_SIZE}px`,
            height: `${HW_SIZE}px`,
            background: "rgb(232 232 194)"
          }}
        ></div>
        <div
          style={{
            width: `${props.width - HW_SIZE}px`,
            height: `${HW_SIZE}px`,
            background: "rgb(232 232 194)",
            display: "flex",
            justifyContent: "flex-end",
            gap:"10px"
          }}
        >
          <button
            onClick={() => {
              if (mainRef?.current) {
                if (props.onSave) {
                  //@ts-ignore
                  props.onSave(mainRef.current.saveRegionList());
                }
              }
            }}
          >
            Save
          </button>

          <button
            onClick={() => {
               
            }}
          >
            Download
          </button>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: `${HW_SIZE}px`,
            height: `${props.height - HW_SIZE}px`,
            background: "rgb(232 232 194)",
            display: "block",
            justifyContent: "flex-end"
          }}
        >
          <button
            style={{
              width: "100%",
              height: "50px",
              padding: 0
            }}
            onClick={() => {
              if (mainRef?.current) {
                if (props.onSave) {
                  //@ts-ignore
                  props.onSave(mainRef.current.setDrawModePolly());
                }
              }
            }}
          >
            Poly
          </button>

          <button
            style={{
              width: "100%",
              height: "50px",
              padding: 0
            }}
            onClick={() => {
              if (mainRef?.current) {
                if (props.onSave) {
                  //@ts-ignore
                  props.onSave(mainRef.current.setDrawModeRect());
                }
              }
            }}
          >
            Rect
          </button>
        </div>
        <MainLayout
          ref={mainRef}
          images={props.images}
          imsg={props.messageList || []}
          width={props.width - HW_SIZE}
          height={props.height - HW_SIZE}
          gap={16}
        />
      </div>
    </div>
  );
});

export default Annotator;
