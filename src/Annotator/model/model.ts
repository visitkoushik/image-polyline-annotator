export type ShapeType = "Poly" | "RECTANGLE" | "";

export interface IMainLayout {
  images: IAppImage;
  imsg: IMessage[];
  width: number;
  height: number;
  gap?: number;
}

export interface IRegion {
  pix: { x: number; y: number };
  type: string;
  id?: string;
  fill: string;
  color: string;
  points: string;
  strokeWidth: string;
  inEditmode: boolean;
  msg?: IMessage;
}

export interface IAppImage {
  url?: string;
  data?: string | ArrayBuffer | undefined | null;
  name?: string;
  regions?: IRegion[];
}

export interface IAnnotator {
  images: IAppImage[];

  width: number;
  height: number;
  regionClassList?: string[];
  regionTagList?: string[];
  messageList?: IMessage[];
  onSave?: (e: any) => void;
  selectShapePoly?: (e: any) => void;
  selectShapeRect?: (e: any) => void;
  onDownload?: (e: any) => void;
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

export interface IPointer {
  region: IRegion;
  onMouseUp?: (e: any) => void;
  onMouseDown?: (e: any) => void;
  isEnabled?: boolean;
  selected?: any;
}

export interface IShapePolygon {
  region: IRegion;
  onSelectShape?: (e: IRegion) => void;
}
