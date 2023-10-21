import React, { useEffect, useReducer, useRef, useState } from "react";
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
import ClassLabel from "../ClassLabel";

const MainLayout = (props: IMainLayout) => {
  const [imgIndex, setImgIndex] = useState<number>(0);
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

  const updateRegionList = (region: IRegion): IRegion[] => {
    const newRegionList = regionList.map((r: IRegion) => {
      if (region.id === r.id) {
        return region;
      }
      return r;
    });
    setRegionList(newRegionList);
    return newRegionList;
  };
  // const [selectedRegion, setSelectedRegion] = useReducer(
  //   (selectedRegion: IRegion | null, updates: IRegion | null): IRegion => {
  //     if (!updates?.points) {
  //       return {} as unknown as IRegion;
  //     }
  //     const pointsArray = updates.points.split(" ");
  //     console.log(pointsArray);
  //     if (pointsArray.length > 4) {
  //       if (
  //         pointsArray.slice(0, 2).join(" ") ===
  //         pointsArray.slice(pointsArray.length - 2).join(" ")
  //       ) {
  //         return {
  //           ...updates,
  //           points: pointsArray.slice(0, pointsArray.length - 2).join(" ")
  //         };
  //       }
  //     }
  //     updateRegionList({ ...updates });
  //     return { ...updates };
  //   },
  //   {} as unknown as IRegion
  // );
  const [selectedRegion, setSelectedRegion] = useState<IRegion | null>({...initalstate});
  //useState<IRegion | null>(null);
  // const [drawMode, setDrawMode] = useState<ShapeType>('Poly');
  const [isDrawable, setDrawable] = useState<boolean>(false);
  const [isEditable, setEditable] = useState<boolean>(false);
  const [len, setLen] = useState<number>(0);
  const [newPoly, setNewPoly] = useState<boolean>(true);

  const [coordinate, setCoordinate] = useState<string>("");
  const [pix, setPix] = useState<{ x: number; y: number }>();

  const [showOverlay, setShowOverlay] = useState<boolean>(false);

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

  const appimg: IAppImage[] = props.images;
  const styleBoard = {
    width: `${appimg[imgIndex].width ? appimg[imgIndex].width : "100%"}`,
    height: `${appimg[imgIndex].height ? appimg[imgIndex].height : "100%"}`,
    left: "0",
    top: "0",
    position: "absolute" as any
  };

  const handleSave = (e: IRegion) => {
    updateRegionList(e);
    setShowOverlay(false);
  };

  const handleSelection = (e: IRegion) => {
    updateRegionList(e);
  };

  const handleRegionDelete = (e: IRegion) => {
    const rgl = regionList.filter((r: IRegion) => r.id !== e.id);
    setShowOverlay(false)
    setSelectedRegion(null);
    setRegionList([...rgl]);
  };

  const handleClick = (e: IRegion) => {
    setSelectedRegion({ ...e, inEditmode: true });
    setShowOverlay(true);
  };

  const mouseDown = (e: any) => {
    if (e.button !== 0) {
      return;
    }
    if (coordinate) {
      onCreatePolygon();
    }

    if(!isDrawable && !isEditable && selectedRegion?.points){
      setSelectedRegion(null)
      return;
    }


    setDrawable(true);

    setEditable(true);

    let clonedRegion =
      newPoly || !selectedRegion
        ? {
            ...defaultPolyRegion,
            points: `${XSampling(pix, e.clientX)} ${YSampling(pix, e.clientY)}`
          }
        : { ...selectedRegion };
    setLen(0);

    setSelectedRegion({ ...clonedRegion });

    setNewPoly(false);
  };

  const mouseMove = (e: any) => {
    if (e.button !== 0 || !isDrawable || !selectedRegion) return;

    if (coordinate) {
      if (e.button === 0) {
        if (selectedRegion?.points) {
          setSelectedRegion({
            ...selectedRegion,
            points: selectedRegion.points.replaceAll(
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
    let clonedRegion = { ...selectedRegion };
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

    setSelectedRegion({ ...clonedRegion });
  };

  const mouseUp = (e: any) => {
    if (e.button !== 0 || !isDrawable || !isEditable || !selectedRegion) return;
    setEditable(false);
    let clonedRegion = { ...selectedRegion };
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

    const cStateUpdated = { ...cState, points: selectedRegion.points };
    const indx = regionList.findIndex((r) => r.id === cStateUpdated.id);
    if (indx === -1) {
      setRegionList((prevlist) => [...prevlist, cStateUpdated]);
    } else {
      const rgl = [...regionList];
      rgl[indx] = cStateUpdated;
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
      {selectedRegion && !selectedRegion.id && selectedRegion.inEditmode && (
        <div>
          <Pointer
            pix={pix || { x: 1, y: 1 }}
            region={{ ...selectedRegion }}
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
        {selectedRegion && <ShapePoly {...selectedRegion} />}
        <>
          {[...regionList]
            .filter((f) => f.id !== selectedRegion?.id)
            .map((r: IRegion) => (
              <ShapePolygon {...r} key={r.id + "_polygon"} />
            ))}
        </>
      </svg>
      {selectedRegion?.id && selectedRegion?.inEditmode && (
        <div>
          <Pointer
            pix={pix || { x: 1, y: 1 }}
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
        regionList.length &&
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
  );
};

export default MainLayout;
