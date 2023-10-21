export type ShapeType = "Poly" | "Eclipse" | "";

 

export interface IMainLayout {
  images: IAppImage[];
  imsg: IMessage[];
}

export interface IRegion {
  pix: { x: number; y: number };
  type: ShapeType;
  id?: string;
  fill: string;
  color: string;
  points: string;
  strokeWidth: string;
  x?: number;
  y?: number;
  inEditmode: boolean;
  msg?: IMessage;
}

export interface IAppImage {
  url: string;
  name?: string;
  width?: string;
  height?: string;
}

export interface IAnnotator {
  images: IAppImage[];
  regionClassList?: string[];
  regionTagList?: string[];
  messageList?: IMessage[];
}

export interface IClassLable {
  onClick?: (e: any) => void;
  onSave?: (e: IRegion) => void;
  onSelectionChange?: (e: IRegion) => void;
  onDelete?: (e: IRegion) => void;
  region: IRegion;
  pix: { x: number; y: number };
  msglist: IMessage[];
}

export interface IMessage {
  label: string;
  value: number;
}
