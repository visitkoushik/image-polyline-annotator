import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState
} from "react";
import ShapePoly from "../draw-shapes/shape-poly-line";
import { IAppImage, IMainLayout, IRegion, ShapeType } from "../model/model";
import ShapePolygon from "../draw-shapes/shape-polygon";
import Pointer from "../pointer";

import ClassLabel from "../ClassLabel";
import { mousePolyEvent } from "../draw-shapes/mousePolyEvent";
import { mouseRectEvent } from "../draw-shapes/mouseRectEvent";

const MainLayout = forwardRef((props: IMainLayout, ref) => {
  const [imgIndex, setImgIndex] = useState<number>(1);
  const [appimg, setAppimg] = useState<IAppImage[]>();
  const [regionList, setRegionList] = useState<IRegion[]>([]);
  const initalstate: IRegion = {
    type: "Poly",
    fill: "rgba(255,0,0,0.25)",
    color: "rgba(255,0,0,0.75)",
    strokeWidth: "2",
    points: "",
    inEditmode: true,
    pix: { x: 1, y: 1 }
  };

  const [selectedRegion, setSelectedRegion] = useState<IRegion | null>({
    ...initalstate
  });
  //useState<IRegion | null>(null);
  const [drawMode, setDrawMode] = useState<ShapeType>("");
  const [isDrawable, setDrawable] = useState<boolean>(false);
  const [isEditable, setEditable] = useState<boolean>(false);
  const [len, setLen] = useState<number>(0);
  const [newPoly, setNewPoly] = useState<boolean>(true);

  const [coordinate, setCoordinate] = useState<string>("");
  const [pix, setPix] = useState<{ x: number; y: number }>({
    x: 1,
    y: 1
  });
  const [imgPos, setImgPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const imgref = useRef(null);
  const styleBoard = {
    width: `calc(100% - ${(props.gap || 0) / 2}px)`,
    height: `calc(100% - ${(props.gap || 0) / 2}px )`,
    left: "0px",
    top: "0px",
    position: "absolute" as any
  };
  const styleBoardContainer = {
    width: `${props.width ? props.width - (props.gap || 0) + "px" : "100%"}`,
    height: `${props.height ? props.height - (props.gap || 0) + "px" : "100%"}`,
    left: `${(props.gap || 0) / 2}px`,
    top: `${(props.gap || 0) / 2}px`,
    position: "relative" as any
  };
  let defaultPolyRegion: IRegion = {
    type: "Poly",
    fill: "rgba(255,0,0,0.25)",
    color: "rgba(255,0,0,0.75)",
    strokeWidth: "2",
    points: "",
    inEditmode: true,
    pix: pix || { x: 1, y: 1 }
  };

  useEffect(() => {
    setPix({ x: props.width, y: props.height });
    setRegionList(
      regionList.map((r: IRegion) => ({
        ...r,
        pix: { x: props.width, y: props.height }
      }))
    );
    if (selectedRegion) {
      setSelectedRegion({
        ...selectedRegion,
        pix: { x: props.width, y: props.height }
      });
    }
  }, [props.width, props.height]);

  useEffect(() => {
    if (defaultPolyRegion && pix) {
      defaultPolyRegion.pix = pix || { x: 1, y: 1 };
    }
    let boundingBox: any = null;
    if (imgref?.current) {
      //@ts-ignore
      boundingBox = imgref.current.getBoundingClientRect();
    }

    setImgPos({
      x: boundingBox ? boundingBox.left : 1,

      y: boundingBox ? boundingBox.top : 1
    });
  }, [pix]);

  useEffect(() => {
    setAppimg(props.images);
    if (
      props.images &&
      props.images[imgIndex] &&
      props.images[imgIndex].regions
    ) {
      setRegionList([...(props.images[imgIndex].regions || [])]);
    }

    setDrawMode("");
    setDrawable(false);
    setEditable(true);
    setCoordinate("");
    setSelectedRegion(null);
    setNewPoly(false);
    setLen(0);
  }, [props.images, imgIndex]);

  useImperativeHandle(ref, () => ({
    saveRegionList: () => {
      if (appimg) {
        return {
          ...appimg[imgIndex],
          regions: [...regionList]
        };
      }
      return null;
    },
    setDrawModePolly: () => {
      setDrawMode("Poly");
    },
    setDrawModeRect: () => {
      setDrawMode("RECTANGLE");
    }
  }));

  const onCreatePolygon = () => {
    if (!selectedRegion) {
      return;
    }
    const cState = {
      ...selectedRegion,
      id: selectedRegion.id || Date.now() + "",
      inEditmode: false
    };
    selectedRegion.points = selectedRegion.points
      .split(" ")
      .splice(0, selectedRegion.points.split(" ").length - 2)
      .join(" ");

    selectedRegion.points = `${selectedRegion.points} ${
      selectedRegion.points.split(" ")[0]
    } ${selectedRegion.points.split(" ")[1]}`;

    const length = Array.from(new Set(selectedRegion.points.split(" "))).length;
    const type = length !== 4 ? "Polygon" : "Rectangle";
    const cStateUpdated = {
      ...cState,
      points: selectedRegion.points,
      type: type
    };
    const indx = regionList.findIndex((r) => r.id === cStateUpdated.id);
    if (indx === -1) {
      const rgl = [...regionList, cStateUpdated];
      setRegionList([...rgl]);
    } else {
      const rgl = [...regionList].map((r: IRegion) => {
        if (r.id === cStateUpdated.id) {
          return cStateUpdated;
        }
        return r;
      });
      setRegionList([...rgl]);
    }

    setSelectedRegion({ ...cStateUpdated, inEditmode: true });
    setNewPoly(true);
    setDrawable(false);
    setEditable(false);
    setCoordinate("");
  };

  const onMouseDownPointer = (e: any) => {
    if (!selectedRegion) {
      return;
    }
    if (coordinate) {
      onCreatePolygon();
      return;
    }

    setDrawable(true);
    if (e.button === 0) {
      setCoordinate(e.target.attributes.data.value.split(",").join(" "));
    }
  };

  //onMous up of pointer
  const onMouseUpPointer = () => {
    setCoordinate("");
    setDrawable(false);
  };

  const polyEvent = mousePolyEvent(
    coordinate,
    setCoordinate,
    selectedRegion,
    setSelectedRegion,
    isDrawable,
    isEditable,
    setDrawable,
    setEditable,
    imgPos,
    defaultPolyRegion,
    newPoly,
    setNewPoly,
    pix,
    len,
    setLen,
    onCreatePolygon,
    regionList,
    setRegionList,
    setShowOverlay,
    drawMode,
    setDrawMode
  );
  const rectEvent = mouseRectEvent(
    coordinate,
    setCoordinate,
    selectedRegion,
    setSelectedRegion,
    isDrawable,
    isEditable,
    setDrawable,
    setEditable,
    imgPos,
    defaultPolyRegion,
    newPoly,
    setNewPoly,
    pix,
    len,
    setLen,
    onCreatePolygon,
    regionList,
    setRegionList,
    setShowOverlay,
    drawMode,
    setDrawMode
  );
  const getMouseDown = () => {
    if (drawMode === "Poly") {
      return polyEvent.mouseDown;
    }
    if (drawMode === "RECTANGLE") {
      return rectEvent.mouseDown;
    }
    return () => {};
  };
  const getMouseUp = () => {
    if (drawMode === "Poly") {
      return polyEvent.mouseUp;
    }
    if (drawMode === "RECTANGLE") {
      return rectEvent.mouseUp;
    }
    return () => {};
  };
  const getMouseMove = () => {
    if (drawMode === "Poly") {
      return polyEvent.mouseMove;
    }
    if (drawMode === "RECTANGLE") {
      return rectEvent.mouseMove;
    }
    return () => {};
  };

  const handleSave = (e: IRegion) => {
    setShowOverlay(false);
  };

  const handleSelection = (e: IRegion) => {
    if (selectedRegion) {
      setSelectedRegion({ ...selectedRegion, msg: e.msg });
    }
  };

  const handleRegionDelete = (e: IRegion) => {
    const rgl = regionList.filter((r: IRegion) => r.id !== e.id);
    setShowOverlay(false);
    setSelectedRegion(null);
    setRegionList([...rgl]);
  };

  const handleClick = (e: IRegion) => {
    const region = regionList.find((r: IRegion) => r.id === e.id);
    if (region) {
      setSelectedRegion({ ...region, inEditmode: true });
    }
    setShowOverlay(true);
    setDrawMode("Poly");
  };
  return appimg && appimg.length > imgIndex ? (
    <div style={styleBoardContainer}>
      <img
        ref={imgref}
        src={appimg[imgIndex].url}
        style={styleBoard}
        alt={appimg[imgIndex].name || ""}
        onLoad={(e: any) => {
          setPix({ x: e.target.offsetWidth, y: e.target.offsetHeight });
        }}
      />
      {selectedRegion && !selectedRegion.id && selectedRegion.inEditmode && (
        <div>
          <Pointer region={{ ...selectedRegion }} isEnabled={false} />
        </div>
      )}

      <svg
        style={{
          ...styleBoard,
          cursor: `${drawMode === "" ? "default" : "crosshair"}`
        }}
        onMouseDown={getMouseDown()}
        onMouseMove={getMouseMove()}
        onMouseUp={getMouseUp()}
      >
        {selectedRegion && <ShapePoly {...selectedRegion} />}
        <>
          {[...regionList]
            .filter((f) => f.id !== selectedRegion?.id)
            .map((r: IRegion) => (
              <ShapePolygon
                {...r}
                key={r.id + "_shape"}
                onSelectShape={() => {
                  setSelectedRegion(r);
                }}
              />
            ))}
        </>
      </svg>
      {selectedRegion?.id && selectedRegion?.inEditmode && (
        <div>
          <Pointer
            region={{ ...selectedRegion }}
            onMouseDown={onMouseDownPointer}
            onMouseUp={onMouseUpPointer}
            isEnabled={true}
            selected={coordinate}
          />
        </div>
      )}
      {showOverlay && (
        <div style={styleBoard} onClick={(e: any) => e.stopPropagation()}></div>
      )}
      {pix &&
        regionList &&
        regionList.length > 0 &&
        regionList.map((r: IRegion) => (
          <ClassLabel
            key={r.id + "class"}
            region={r}
            pix={pix}
            msglist={props.imsg}
            onSave={handleSave}
            onSelectionChange={handleSelection}
            onDelete={handleRegionDelete}
            onClick={handleClick}
          />
        ))}
    </div>
  ) : (
    <>No image resource available</>
  );
});

export default MainLayout;
