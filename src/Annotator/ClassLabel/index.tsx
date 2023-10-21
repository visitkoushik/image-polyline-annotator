import { useEffect, useState } from "react";
import { ReverseSampling_X, ReverseSampling_Y } from "../model/constants";
import { IClassLable, IMessage, IRegion } from "../model/model";
import Select, { ActionMeta, StylesConfig } from "react-select";
import "./clslabel.css";

const ClassLabel = (props: IClassLable) => {
  const [openmodal, setOpenModal] = useState(props.region?.msg === undefined);
  const [region, setRegion] = useState<IRegion>({ ...props.region });

  const colorStyle: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
      fontSize: "0.8rem",
      fontWeight: "500"
    })
  };

  useEffect(()=>{

    if(!region.msg){
        if (props.onClick) props.onClick(region);
    }

  },[])
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
      region.msg = newValue as IMessage;
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
              <div className="typeheader">Polygon</div>
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
            <div className="inputbody">
              <Select
                options={props.msglist}
                styles={colorStyle}
                placeholder="Select Error Code"
                value={region.msg}
                onChange={handleOnChange}
              />
            </div>
            <div className="footer">
              <div
                className="buttondone"
                onClick={(e: any) => {
                  if (props.onSave) props.onSave(e);
                  setOpenModal(false || region.msg === undefined);
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
            {region.msg?.label || "Select "}
          </div>
        )}
      </>
    );
  }
  return <></>;
};

export default ClassLabel;
