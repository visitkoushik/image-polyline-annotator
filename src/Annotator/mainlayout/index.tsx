import React, { useEffect, useRef, useState } from "react";
import ShapePoly from "../draw-shapes/shape-poly-line";
import { IAppImage, IMainLayout, IRegion, ShapeType } from "../model/model";
import ShapePolygon from "../draw-shapes/shape-polygon";
import Pointer from "../pointer";
import {
  Pointer_Height_Width,
  ReverseSampling_X,
  ReverseSampling_Y,
  XSampling,
  YSampling
} from "../model/constants";

const MainLayout = (prop: IMainLayout) => {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [regionList, setRegionList] = useState<IRegion[]>([]);
  const [state, setState] = useState<IRegion | null>(null);
  const [drawMode, setDrawMode] = useState<ShapeType>("");
  const [isEditable, setEditable] = useState<boolean>(false); 
  const [len, setLen] = useState<number>(0);
  const [newPoly, setNewPoly] = useState<boolean>(true); 

  const [coordinate, setCoordinate] = useState<string>("");
  const [pix, setPix] = useState<{ x: number; y: number }>();

  const imgref = useRef(null);

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
    if (defaultPolyRegion && pix) {
      defaultPolyRegion.pix = pix || { x: 1, y: 1 };
    }
  }, [pix]);

  const appimg: IAppImage[] = prop.images;
  const styleBoard = {
    width: `${appimg[imgIndex].width ? appimg[imgIndex].width : "100%"}`,
    height: `${appimg[imgIndex].height ? appimg[imgIndex].height : "100%"}`,
    left: "0",
    top: "0",
    position: "absolute" as any
  };

  const mouseDown = (e: any) => {
    if (e.button !== 0) {
      return;
    }
    if (coordinate) {
      onCreatePolygon();
    }
 
    setDrawMode("Poly");

    setEditable(true);

    let clonedRegion =
      newPoly || !state
        ? {
            ...defaultPolyRegion,
            points: `${XSampling(pix, e.clientX)} ${YSampling(pix, e.clientY)}`
          }
        : { ...state };
    setLen(0);

    setState({ ...clonedRegion });

    setNewPoly(false);
  };

  const mouseMove = (e: any) => {
    if (e.button !== 0 || drawMode === "" || !state) return;

    if (coordinate) {
      if (e.button === 0) {
        if (state?.points) {
          setState({
            ...state,
            points: state.points.replace(
              coordinate,
              `${XSampling(pix, e.clientX)} ${YSampling(pix, e.clientY)}`
            )
          });
          setCoordinate(
            `${XSampling(pix, e.clientX)} ${YSampling(pix, e.clientY)}`
          );
        }
      }
      return;
    }
    let clonedRegion = { ...state };
    clonedRegion.x = XSampling(pix, e.clientX);
    clonedRegion.y = YSampling(pix, e.clientY);

    clonedRegion = {
      ...clonedRegion,
      points: !clonedRegion.points
        ? `${clonedRegion.x} ${clonedRegion.y}`
        : `${clonedRegion.points
            .trim()
            .split(" ")
            .slice(0, clonedRegion.points.trim().split(" ").length - len)
            .join(" ")} ${clonedRegion.x} ${clonedRegion.y}`
    };

    setLen(2);

    setState({ ...clonedRegion });
  };

  const mouseUp = (e: any) => {
    if (e.button !== 0 || drawMode === "" || !isEditable || !state) return;
    setEditable(false);
    let clonedRegion = { ...state };
    let x = +clonedRegion.points.trim().split(" ")[0];
    let y = +clonedRegion.points.trim().split(" ")[1];

    if (
      clonedRegion.points.split(" ").length > 6 &&
      ReverseSampling_X(pix, x) - Pointer_Height_Width <= e.clientX &&
      ReverseSampling_Y(pix, y) - Pointer_Height_Width <= e.clientY &&
      ReverseSampling_X(pix, x) + Pointer_Height_Width >= e.clientX &&
      ReverseSampling_Y(pix, y) + Pointer_Height_Width >= e.clientY
    ) {
      onCreatePolygon();
    }
  };

  const onCreatePolygon = () => {
    if (!state) {
      return;
    }
    const cState = {
      ...state,
      id: state.id || Date.now() + "",
      inEditmode: false
    };
    state.points = state.points
      .split(" ")
      .splice(0, state.points.split(" ").length - 2)
      .join(" ");

    state.points = `${state.points} ${state.points.split(" ")[0]} ${
      state.points.split(" ")[1]
    }`;

    const cStateUpdated = { ...cState, points: state.points };
    const indx = regionList.findIndex((r) => r.id === cStateUpdated.id);
    if (indx === -1) {
      setRegionList((prevlist) => [...prevlist, cStateUpdated]);
    } else {
      const rgl = [...regionList];
      rgl[indx] = cStateUpdated;
      setRegionList([...rgl]);
    }

    setState({ ...cStateUpdated, inEditmode: true });
    setNewPoly(true); 
    setDrawMode("");
    setEditable(false);
    setCoordinate("");
  };

  const onClickPointer = (e: any) => {
    if (!state) {
      return;
    }
    if (coordinate) {
      onCreatePolygon();
      return;
    }

    setDrawMode("Poly");
    if (e.button === 0) {
      setCoordinate(e.target.attributes.data.value.split(",").join(" "));
    }
  };

  return (
    <div style={styleBoard}>
      <img
        ref={imgref}
        src={appimg[imgIndex].url}
        style={styleBoard}
        alt={appimg[imgIndex].name || ""}
        onLoad={(e: any) => {
          setPix({ x: e.target.offsetWidth, y: e.target.offsetHeight });
        }}
      />
      {state && !state.id && state.inEditmode && (
        <div>
          <Pointer
            pix={pix || { x: 1, y: 1 }}
            region={{ ...state }}
            isEnabled={false}
          />
        </div>
      )}
      <svg
        style={styleBoard}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
      >
        {state && <ShapePoly {...state} />}
        <ShapePolygon
          pix={pix || { x: 1, y: 1 }}
          regionlist={[...regionList].filter((f) => f.id !== state?.id)}
        />
      </svg>
      {state?.id && state?.inEditmode && (
        <div>
          <Pointer
            pix={pix || { x: 1, y: 1 }}
            region={{ ...state }}
            onMouseDown={onClickPointer}
            isEnabled={true}
          />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
