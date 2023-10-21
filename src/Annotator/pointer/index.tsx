import {
  Pointer_Height_Width,
  ReverseSampling_X,
  ReverseSampling_Y
} from "../model/constants";
import { IRegion } from "../model/model";

export interface IPointer {
  region: IRegion;
  onMouseUp?: (e: any) => void;
  onMouseDown?: (e: any) => void;
  isEnabled?: boolean;
  selected?: any;
  pix: { x: number; y: number };
}

const Pointer = (props: IPointer) => {
  const coordinates: number[][] = [];
  let allpoints = props.region.points.split(' ');
  debugger
  if(allpoints.length<=1){
    return <></>
  }
 
  for (
    let i = 0, points = allpoints;
    i < points.length;
    i += 2
  ) {
    coordinates.push([+points[i], +points[i + 1]]);
  }

  return (
    <>
      {coordinates.map((c: number[], indx: number) => {
        return (
          <div
            key={props.region.id + "_" + indx}
            {...{ data: [...c] }}
            style={{
              position: "absolute",
              left:
                ReverseSampling_X(props.pix, c[0]) - Pointer_Height_Width / 2,
              top:
                ReverseSampling_Y(props.pix, c[1]) - Pointer_Height_Width / 2,
              width: Pointer_Height_Width,
              height: Pointer_Height_Width,
              border: `1px solid #ffffff`,
              backgroundColor: `${
                props.selected === c.join(" ") ? "#ffffff" : "#00000000"
              }`
            }}
            onMouseUp={props.isEnabled ? props.onMouseUp : () => {}}
            onMouseDown={props.isEnabled ? props.onMouseDown : () => {}}
          ></div>
        );
      })}
    </>
  );
};

export default Pointer;
