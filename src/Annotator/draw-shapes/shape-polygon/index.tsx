import { ReverseSampling_X, ReverseSampling_Y, XSampling, YSampling } from "../../model/constants";
import { IShape } from "../../model/model";

const ShapePolygon = (props: IShape) => {
   
  return (
    <>
      {props.regionlist.map((m) => {
        const pnts = m.points
          .split(" ")
          .map((p, inx) =>
            inx % 2 === 0 ? ReverseSampling_X(props.pix, +p) : ReverseSampling_Y(props.pix, +p)
          )
          .join(" "); 
          
        return (
          <polygon
            key={m.id}
            stroke={m.color}
            color={m.color}
            fill={m.fill}
            points={pnts}
            strokeWidth={m.strokeWidth}
          />
        );
      })}
    </>
  );
};

export default ShapePolygon;
