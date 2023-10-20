export const Pointer_Height_Width = 10;

export const XSampling = (
  pix: { x: number; y: number } | undefined,
  x: number | string
) => +(x + "") / (pix?.x || 1);

export const YSampling = (
  pix: { x: number; y: number } | undefined,
  y: number | string
) => +(y + "") / (pix?.y || 1);

export const ReverseSampling_X = (
  pix: { x: number; y: number } | undefined,
  x: number 
) => Math.round( x   * (pix?.x || 1)) ;
export const ReverseSampling_Y = (
  pix: { x: number; y: number } | undefined,
  y: number 
) => Math.round(y * (pix?.y || 1)) ;
