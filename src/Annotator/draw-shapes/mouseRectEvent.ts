import { isEditable } from "@testing-library/user-event/dist/utils";
import {
  Pointer_Height_Width,
  ReverseSampling_X,
  ReverseSampling_Y,
  XSampling,
  YSampling
} from "../model/constants";
import { IRegion, ShapeType } from "../model/model";

export const mouseRectEvent = (
  coordinate: string,
  setCoordinate: any,
  selectedRegion: IRegion | null,
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
  setShowOverlay: any,
  drawMode: ShapeType,
  setDrawMode: React.Dispatch<React.SetStateAction<ShapeType>>
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
      updateRegionList({...selectedRegion});
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

    let clonedRegion = { ...selectedRegion };
    const clonedRegion_x = XSampling(pix, e.clientX - imgPos.x);
    const clonedRegion_y = YSampling(pix, e.clientY - imgPos.y);

    const allpoints = clonedRegion.points?.trim().split(" ").slice(0, 2);

    const x = `${allpoints[0]} ${allpoints[1]} ${allpoints[0]} ${clonedRegion_y} ${clonedRegion_x} ${clonedRegion_y} ${clonedRegion_x} ${allpoints[1]} ${allpoints[0]} ${allpoints[1]}`;

    clonedRegion = {
      ...clonedRegion,
      points: x
    };

    setLen(2);

    setSelectedRegion({ ...clonedRegion });
  };

  const mouseUp = (e: any) => {
    if (e.button !== 0 || !isDrawable || !isEditable || !selectedRegion) return;

    setEditable(false);
    onCreatePolygon();
  };
 

  return {
    mouseDown,
    mouseMove,
    mouseUp 
  };
};
