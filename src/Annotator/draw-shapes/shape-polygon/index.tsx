import {
  ReverseSampling_X,
  ReverseSampling_Y,
  XSampling,
  YSampling
} from "../../model/constants";
import { IRegion } from "../../model/model";

const ShapePolygon = (region: IRegion) => {

  
  const pnts = region.points
    .split(" ")
    .map((p: string, inx: number) =>
      inx % 2 === 0
        ? ReverseSampling_X(region.pix, +p)
        : ReverseSampling_Y(region.pix, +p)
    )
    .join(" ");
  return (
    <>
      {
        <polygon
          stroke={region.color}
          color={region.color}
          fill={region.fill}
          points={pnts}
          strokeWidth={region.strokeWidth}
        />
      }
    </>
  );
};

export default ShapePolygon;
