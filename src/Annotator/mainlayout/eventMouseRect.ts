import { XSampling, YSampling } from "../model/constants";
import { IRegion, ShapeType } from "../model/model";

export const mouseRectEvent = (
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

    const allpoints = clonedRegion.points?.trim().split(" ").slice(0, 2);

    const x = `${allpoints[0]} ${allpoints[1]} ${allpoints[0]} ${clonedRegion_y} ${clonedRegion_x} ${clonedRegion_y} ${clonedRegion_x} ${allpoints[1]} ${allpoints[0]} ${allpoints[1]}`;

    clonedRegion = {
      ...clonedRegion,
      points: x
    };
 

    setSelectedRegion({ ...clonedRegion });
  };

  const mouseUp = (e: any) => {
    if (e.button !== 0 || !isDrawable || !isEditable || !selectedRegion) return;

    setEditable(false);
    if (coordinate.length === 0) onCreatePolygon();
  };

  return {
    mouseDown,
    mouseMove,
    mouseUp
  };
};
