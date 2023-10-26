import {
  Pointer_Height_Width,
  ReverseSampling_X,
  ReverseSampling_Y,
  XSampling,
  YSampling
} from "../model/constants";
import { IRegion, ShapeType } from "../model/model";

export const mousePolyEvent = (
  coordinate: string,
  setCoordinate: any,
  selectedRegion: IRegion | null | undefined,
  setSelectedRegion: any,
  isDrawable: boolean,
  isEditable: boolean,
  setDrawable: any,
  setEditable: any,
  imgPos: { x: number; y: number },
  defaultPolyRegion: IRegion,
  newPoly: boolean,
  setNewPoly: any,
  pix: { x: number; y: number },
  len: number,
  setLen: any,
  onCreatePolygon: any,
  regionList: IRegion[],
  setRegionList: any,
  setDrawMode: (shp:ShapeType)=>void
) => {
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

  const mouseDown = (e: any) => {
    if (e.button !== 0) {
      return;
    }
    if (coordinate) {
      onCreatePolygon();
    }
    if (!isDrawable && !isEditable && selectedRegion?.points) {
      updateRegionList({ ...selectedRegion });
      setSelectedRegion(null);
      setDrawMode("");
      return;
    }

    setDrawable(true);

    setEditable(true);

    let clonedRegion =
      newPoly || !selectedRegion
        ? {
            ...defaultPolyRegion,
            points: `${XSampling(pix, e.clientX - imgPos.x)} ${YSampling(
              pix,
              e.clientY - imgPos.y
            )}`
          }
        : { ...selectedRegion };
    setLen(0);

    setSelectedRegion({ ...clonedRegion });

    setNewPoly(false);
  };

  const mouseMove = (e: any) => {
    if (e.button !== 0 || !isDrawable || !selectedRegion) return;

    if (coordinate.length > 0) {
      if (e.button === 0) {
        if (selectedRegion?.points) {
          setSelectedRegion({
            ...selectedRegion,
            points: selectedRegion.points.replaceAll(
              coordinate,
              `${XSampling(pix, e.clientX - imgPos.x)} ${YSampling(
                pix,
                e.clientY - imgPos.y
              )}`
            )
          });
          setCoordinate(
            `${XSampling(pix, e.clientX - imgPos.x)} ${YSampling(
              pix,
              e.clientY - imgPos.y
            )}`
          );
        }
      }
      return;
    }
    let clonedRegion = { ...selectedRegion };
    const clonedRegion_x = XSampling(pix, e.clientX - imgPos.x);
    const clonedRegion_y = YSampling(pix, e.clientY - imgPos.y);

    clonedRegion = {
      ...clonedRegion,
      points: !clonedRegion.points
        ? `${clonedRegion_x} ${clonedRegion_y}`
        : `${clonedRegion.points
            .trim()
            .split(" ")
            .slice(0, clonedRegion.points.trim().split(" ").length - len)
            .join(" ")} ${clonedRegion_x} ${clonedRegion_y}`
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
      ReverseSampling_X(pix, x) - Pointer_Height_Width <=
        e.clientX - imgPos.x &&
      ReverseSampling_Y(pix, y) - Pointer_Height_Width <=
        e.clientY - imgPos.y &&
      ReverseSampling_X(pix, x) + Pointer_Height_Width >=
        e.clientX - imgPos.x &&
      ReverseSampling_Y(pix, y) + Pointer_Height_Width >= e.clientY - imgPos.y
    ) {
      onCreatePolygon();
    }
  };

  return {
    mouseDown,
    mouseMove,
    mouseUp
  };
};
