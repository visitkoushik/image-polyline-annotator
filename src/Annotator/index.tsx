import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import MainLayout from "./mainlayout";
import { IAnnotator, IAppImage } from "./model/model";
import "./index.css";

const Annotator = forwardRef((props: IAnnotator, ref) => {
  const HW_SIZE = 50;
  const mainRef = useRef(null);
  const annoteEvents = useRef(null);
  const [imgIndex, setImgIndex] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<IAppImage>();

  useEffect(() => {
    if (props.images[imgIndex]) {
      const imgsrc = props.images[imgIndex].url;
      if (props.images[imgIndex].data) {
        setSelectedImage({
          ...props.images[imgIndex],
          data: props.images[imgIndex].data
        });
        return;
      }
      if (imgsrc) {
        fetch(imgsrc)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () {
              // Display the image as a base64 Data URL
              setSelectedImage({
                ...props.images[imgIndex],
                data: reader.result
              });
            };
          })
          .catch((error) => {
            console.error("Error fetching the image:", error);
          });
      }
    }
  }, [props.images, imgIndex]);

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
            width: `${props.width}px`,
            height: `${HW_SIZE}px`,
            background: "rgb(232 232 194)",
            display: "flex",
            justifyContent: "space-between",
            gap: "10px"
          }}
        >
          <div
            style={{
              height: `${HW_SIZE}px`
            }}
            className="label"
          >
            {props.label ?? "Draw Anotation"}
          </div>
          <div
            style={{
              height: `${HW_SIZE}px`,
              background: "#00000000",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px"
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
                if (mainRef?.current) {
                  if (props.onSave) {
                    //@ts-ignore
                    mainRef.current.downloadasImage();
                  }
                }
              }}
            >
              Download
            </button>
          </div>
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
        {selectedImage ? (
          <MainLayout
            ref={mainRef}
            images={selectedImage}
            iantTag={props.messageList || []}
            width={props.width - HW_SIZE}
            height={props.height - HW_SIZE}
            gap={16}
          />
        ) : (
          <div> Image not available now</div>
        )}
      </div>
    </div>
  );
});

export default Annotator;
