import {
  ReverseSampling_X,
  ReverseSampling_Y
} from "../../model/constants";
import { IRegion, IShapePolygon } from "../../model/model";


const ShapePolygon = (props: IShapePolygon) => {
  if (!props.region?.points) {
    return <></>;
  }
  const pnts = props.region.points
    .split(" ")
    .map((p: string, inx: number) =>
      inx % 2 === 0
        ? ReverseSampling_X(props.region.pix, +p)
        : ReverseSampling_Y(props.region.pix, +p)
    )
    .join(" ");
  return (
    <>
      {
        <polygon
          stroke={props.region.color}
          color={props.region.color}
          fill={props.region.fill}
          points={pnts}
          strokeWidth={props.region.strokeWidth}
          onClick={(e: any) => {
            if (props.onSelectShape) {
              props.onSelectShape(props.region);
            }
          }}
        />
      }
    </>
  );
};

export default ShapePolygon;
