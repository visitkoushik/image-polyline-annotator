import { ReverseSampling_X, ReverseSampling_Y, XSampling, YSampling } from "../../model/constants";
import { IRegion } from "../../model/model";

const ShapePoly = (currentRegion: IRegion ) => {

 
  const pnts = currentRegion.points
  .split(" ")
  .map((p:string, inx:number) =>
    inx % 2 === 0? ReverseSampling_X(currentRegion.pix, +p) : ReverseSampling_Y(currentRegion.pix, +p)
  )
  .join(" ") 
   
  return (
    <>
      {currentRegion && (
        <polyline
          stroke={currentRegion.color}
          fill={currentRegion.fill}
          points={pnts}
          strokeWidth={currentRegion.strokeWidth}
        />
      )}
    </>
  );
};

export default ShapePoly;
