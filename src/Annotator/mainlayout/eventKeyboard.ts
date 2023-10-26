import {
  REGION_KEY_SHIFT_HORIZ,
  REGION_KEY_SHIFT_VERT
} from "../model/constants";
import { IRegion, ShapeType } from "../model/model";

export const EventKeyBoard = (
  setCoordinate: any,
  selectedRegion: IRegion | null | undefined,
  setSelectedRegion: any,

  setDrawable: any,
  setEditable: any,

  setNewPoly: any,
  pix: { x: number; y: number },

  setLen: any,
  onCreatePolygon: any,

  setDrawMode: (s:ShapeType)=>void
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
 

    if (event.code === "Escape") {
      setSelectedRegion(null);
      setDrawMode("");
      setEditable(false);
      setDrawable(false);
      setCoordinate("");
      setNewPoly(false);
      setLen(0);
    }
    if (event.code === "ArrowRight") {
      if (selectedRegion?.id) {
        let pant = "";
        const listOfX = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 === 0);
        const listOfY = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 !== 0);

        const listXNew = listOfX.map(
          (xl: string) => +xl + REGION_KEY_SHIFT_HORIZ / pix.x + ""
        );

        if (listOfY.length === listXNew.length) {
          for (let i = 0; i < listXNew.length; i++) {
            pant = pant + `${listXNew[i]} ${listOfY[i]} `;
          }
        }

        onCreatePolygon({ ...selectedRegion, points: pant.trim() });
        setSelectedRegion({ ...selectedRegion, points: pant.trim() });
      }
    }
    if (event.code === "ArrowLeft") {
      if (selectedRegion?.id) {
        let pant = "";
        const listOfX = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 === 0);
        const listOfY = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 !== 0);

        const listXNew = listOfX.map(
          (xl: string) => +xl - REGION_KEY_SHIFT_HORIZ / pix.x + ""
        );

        if (listOfY.length === listXNew.length) {
          for (let i = 0; i < listXNew.length; i++) {
            pant = pant + `${listXNew[i]} ${listOfY[i]} `;
          }
        }

        onCreatePolygon({ ...selectedRegion, points: pant.trim() });
        setSelectedRegion({ ...selectedRegion, points: pant.trim() });
      }
    }
    if (event.code === "ArrowUp") {
      if (selectedRegion?.id) {
        let pant = "";
        const listOfX = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 === 0);
        const listOfY = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 !== 0);

        const listYNew = listOfY.map(
          (yl: string) => +yl - REGION_KEY_SHIFT_VERT / pix.y + ""
        );

        if (listOfX.length === listYNew.length) {
          for (let i = 0; i < listYNew.length; i++) {
            pant = pant + `${listOfX[i]} ${listYNew[i]} `;
          }
        }

        onCreatePolygon({ ...selectedRegion, points: pant.trim() });
        setSelectedRegion({ ...selectedRegion, points: pant.trim() });
      }
    }
    if (event.code === "ArrowDown") {
      if (selectedRegion?.id) {
        let pant = "";
        const listOfX = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 === 0);
        const listOfY = selectedRegion.points
          .split(" ")
          .filter((f: any, o: number) => o % 2 !== 0);

        const listYNew = listOfY.map(
          (yl: string) => +yl + REGION_KEY_SHIFT_VERT / pix.y + ""
        );

        if (listOfX.length === listYNew.length) {
          for (let i = 0; i < listYNew.length; i++) {
            pant = pant + `${listOfX[i]} ${listYNew[i]} `;
          }
        }

        onCreatePolygon({ ...selectedRegion, points: pant.trim() });
        setSelectedRegion({ ...selectedRegion, points: pant.trim() });
      }
    }
  };

  return {handleKeyDown};
};
