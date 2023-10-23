import { ReverseSampling_X, ReverseSampling_Y } from "../../model/constants";
import { IRegion } from "../../model/model";

const ShapePoly = (region: IRegion) => {
  if (!region?.points) {
    return <></>;
  }
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
      {region && (
        <polyline
          stroke={region.color}
          fill={region.fill}
          points={pnts}
          strokeWidth={region.strokeWidth}
        />
      )}
    </>
  );
};

export default ShapePoly;
