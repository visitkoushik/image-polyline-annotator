export type ShapeType = "Poly" | "RECTANGLE" | "";

export interface IMainLayout {
  images: IAppImage;
  iantTag: IAnnoteClass[];
  width: number;
  height: number;
  gap?: number;
  onChangeDrawMode:(e:ShapeType)=>void;
  onChangeDownload:(e:boolean)=>void
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
  antTag: IAnnoteRigeion;
}

export interface IAppImage {
  url?: string;
  data?: string | ArrayBuffer | undefined | null;
  name?: string;
  regions?: IRegion[];
}

export interface IAnnotator {
  images: IAppImage[];
  label?: string;
  width: number;
  height: number;
  regionClassList?: string[];
  regionTagList?: string[];
  messageList?: IAnnoteClass[];
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
  onChangeColor: (e: IRegion) => void;
  region: IRegion;
  pix: { x: number; y: number };
  annotlist: IAnnoteClass[];
}

export interface IAnnotTags {
  label: string;
  value: number;
}
export interface IAnnoteClass {
  name: string;
  placeHolder: string;
  ianotTag: IAnnotTags[];
}

export interface IAnnoteRigeion {
  [key: string]: IAnnotTags;
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
