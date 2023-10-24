import { useEffect, useState } from "react";
import { ReverseSampling_X, ReverseSampling_Y } from "../model/constants";
import {
  IClassLable,
  IAnnotTags,
  IRegion,
  IAnnoteClass,
  IAnnoteRigeion
} from "../model/model";
import Select, { ActionMeta, StylesConfig } from "react-select";
import "./clslabel.css";

const ClassLabel = (props: IClassLable) => {
  const [openmodal, setOpenModal] = useState(
    Object.keys(props.region?.antTag).length === 0
  );
  const [region, setRegion] = useState<IRegion>({ ...props.region });

  const colorStyle: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
      fontSize: "0.8rem",
      fontWeight: "500",
      marginBottom: "10px"
    })
  };
  useEffect(() => {
    // console.log("REGION UPDATED: ", props.region);
    setRegion({ ...props.region });
  }, [props.region]);

  useEffect(() => {
    if (!region.antTag) {
      if (props.onClick) props.onClick(region);
    }
  }, []);
  if (region) {
    const x: number = Math.min(
      //min x
      ...region.points
        .split(" ")
        .map(Number)
        .filter((f, ind: number) => ind % 2 === 0)
    );
    const y: number = Math.max(
      //max y
      ...region.points
        .split(" ")
        .map(Number)
        .filter((f, ind: number) => ind % 2 !== 0)
    );

    const handleOnChange = (
      newValue: unknown,
      actionMeta: ActionMeta<unknown>
    ) => {
      debugger;
      //@ts-ignore
      region.antTag[actionMeta?.name.toString()] = newValue as IAnnotTags;

      if (props.onSelectionChange) props.onSelectionChange({ ...region });
      setRegion(region);
    };

    return (
      <>
        {openmodal ? (
          <div
            className="modalbody"
            style={{
              left: `${ReverseSampling_X(props.pix, x) + 10}px`,
              top: `${ReverseSampling_Y(props.pix, y) + 10}px`
            }}
          >
            <div className="header">
              <div className="typeheader">{region.type}</div>
              <div className="deletebtn">
                <img
                  src={process.env.PUBLIC_URL + "/delete-77.svg"}
                  alt="delete"
                  onClick={() =>
                    props.onDelete ? props.onDelete(region) : () => {}
                  }
                />
              </div>
            </div>

            {props.annotlist.map((antclass: IAnnoteClass, indx: number) => (
              <div className="inputbody" key={indx + "_classlist"}>
                <Select
                  options={antclass.ianotTag}
                  styles={colorStyle}
                  placeholder={antclass.placeHolder}
                  value={region.antTag[antclass.name]}
                  onChange={handleOnChange}
                  name={antclass.name}
                />
              </div>
            ))}
            <div className="footer">
              <div
                className={`buttondone ${
                  Object.keys(region.antTag).length === props.annotlist.length
                    ? "active"
                    : ""
                }`}
                onClick={(e: any) => {
                  if (props.onSave) props.onSave(e);
                  setOpenModal(false || region.antTag === undefined);
                }}
              >
                <span>✓</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="body"
            onClick={(e: any) => {
              setOpenModal(true);
              if (props.onClick) props.onClick(region);
            }}
            style={{
              left: `${ReverseSampling_X(props.pix, x) + 10}px`,
              top: `${ReverseSampling_Y(props.pix, y) + 10}px`
            }}
          >
            {Object.keys(region.antTag)
              .map((m: string) => `${m}: ${region.antTag[m].label || ""}`)
              .join(" ")}
          </div>
        )}
      </>
    );
  }
  return <></>;
};

export default ClassLabel;
