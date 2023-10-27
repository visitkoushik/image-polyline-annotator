import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import Fullscreen from "react-fullscreen-crossbrowser";
import MainLayout from "./mainlayout";
import { IAnnotator, IAppImage, ShapeType } from "./model/model";
import "./index.css";

const Annotator = forwardRef((props: IAnnotator, ref) => {
  const HW_SIZE = 50;
  const mainRef = useRef(null);
  const annoteEvents = useRef(null);
  const [imgIndex, setImgIndex] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<IAppImage>();
  const [isFullscreenEnabled, setFullscreenEnabled] = useState<boolean>(false);
  const [drawmode, setDrawMode] = useState<ShapeType>("");
  const [downloadEnable, setDownloadEnable] = useState<boolean>(true);
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

  const handleDrawmodeChange = (shp: ShapeType) => {
   
    setDrawMode(shp);
  };
const handleDownloadChange=(e:boolean)=>{
  debugger
  setDownloadEnable(e);
}
  return (
    <>
      <Fullscreen
        enabled={isFullscreenEnabled}
        onChange={(isFullscreenEnabled) =>
          setFullscreenEnabled(isFullscreenEnabled)
        }
      >
        <div ref={annoteEvents}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: `${props.width}px`,
                height: `${HW_SIZE}px`,
                background: "rgb(255 255 255)",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                boxShadow: "rgba(136, 136, 136, 0.533) 0px 7px 20px 0px"
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
                {/* <button
                  className="svg-button"
                  onClick={() => {
                    setFullscreenEnabled(!isFullscreenEnabled);
                  }}
                >
                  fuullscrren
                </button> */}

                <button
                  className={`svg-button ${
                    downloadEnable ? "" : "disabled"
                  }`}
                  onClick={() => {
                    if(!downloadEnable){
                      return;
                    }
                    if (mainRef?.current) {
                      if (props.onSave) {
                        //@ts-ignore
                        mainRef.current.downloadasImage();
                      }
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      fill="currentColor"
                      d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                    ></path>
                  </svg>
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
                background: "rgb(255 255 255)",
                display: "flex",
                flexShrink: "0",
                flexDirection: "column",
                boxShadow: "rgba(136, 136, 136, 0.533) 3px 0px 20px 0px"
              }}
            >
              <button
                className="svg-button"
                onClick={() => {
                  if (mainRef?.current) {
                    //@ts-ignore
                    mainRef.current.setDrawModePolly();
                  }
                }}
                style={{
                  color: `${drawmode === "Poly" ? "#005bff" : "#292929"}`
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="currentColor"
                    d="M384 352c-.35 0-.67.1-1.02.1l-39.2-65.32c5.07-9.17 8.22-19.56 8.22-30.78s-3.14-21.61-8.22-30.78l39.2-65.32c.35.01.67.1 1.02.1 35.35 0 64-28.65 64-64s-28.65-64-64-64c-23.63 0-44.04 12.95-55.12 32H119.12C108.04 44.95 87.63 32 64 32 28.65 32 0 60.65 0 96c0 23.63 12.95 44.04 32 55.12v209.75C12.95 371.96 0 392.37 0 416c0 35.35 28.65 64 64 64 23.63 0 44.04-12.95 55.12-32h209.75c11.09 19.05 31.49 32 55.12 32 35.35 0 64-28.65 64-64 .01-35.35-28.64-64-63.99-64zm-288 8.88V151.12A63.825 63.825 0 0 0 119.12 128h208.36l-38.46 64.1c-.35-.01-.67-.1-1.02-.1-35.35 0-64 28.65-64 64s28.65 64 64 64c.35 0 .67-.1 1.02-.1l38.46 64.1H119.12A63.748 63.748 0 0 0 96 360.88zM272 256c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16-16-7.18-16-16zM400 96c0 8.82-7.18 16-16 16s-16-7.18-16-16 7.18-16 16-16 16 7.18 16 16zM64 80c8.82 0 16 7.18 16 16s-7.18 16-16 16-16-7.18-16-16 7.18-16 16-16zM48 416c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16-16-7.18-16-16zm336 16c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"
                  ></path>
                </svg>
              </button>

              <button
                className="svg-button"
                style={{
                  color: `${drawmode === "RECTANGLE" ? "#005bff" : "#292929"}`
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
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="vector-square"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M512 128V32c0-17.67-14.33-32-32-32h-96c-17.67 0-32 14.33-32 32H160c0-17.67-14.33-32-32-32H32C14.33 0 0 14.33 0 32v96c0 17.67 14.33 32 32 32v192c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h96c17.67 0 32-14.33 32-32h192c0 17.67 14.33 32 32 32h96c17.67 0 32-14.33 32-32v-96c0-17.67-14.33-32-32-32V160c17.67 0 32-14.33 32-32zm-96-64h32v32h-32V64zM64 64h32v32H64V64zm32 384H64v-32h32v32zm352 0h-32v-32h32v32zm-32-96h-32c-17.67 0-32 14.33-32 32v32H160v-32c0-17.67-14.33-32-32-32H96V160h32c17.67 0 32-14.33 32-32V96h192v32c0 17.67 14.33 32 32 32h32v192z"
                  ></path>
                </svg>
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
                onChangeDrawMode={handleDrawmodeChange}
                onChangeDownload={handleDownloadChange}
              />
            ) : (
              <div> Image not available now</div>
            )}
          </div>
        </div>
      </Fullscreen>
    </>
  );
});

export default Annotator;
