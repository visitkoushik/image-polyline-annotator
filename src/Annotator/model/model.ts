export type ShapeType = "Poly" | "Eclipse" | "";

export interface IShape {
  regionlist: IRegion[];
  currentRegion?: IRegion;
  pix: { x: number; y: number };
}

export interface IMainLayout {
  images: IAppImage[];
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
}
