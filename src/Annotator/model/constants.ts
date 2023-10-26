export const Pointer_Height_Width = 10;
export const REGION_KEY_SHIFT_HORIZ = 10;
export const REGION_KEY_SHIFT_VERT = 10;

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
) => Math.round(x * (pix?.x || 1));
export const ReverseSampling_Y = (
  pix: { x: number; y: number } | undefined,

  y: number
) => Math.round(y * (pix?.y || 1));

export const hexToRgba = (hex: any, alpha: number) => {
  // Remove the hash symbol if it's present
  hex = hex.replace("#", "");
 
  // Parse the hex values for red, green, and blue components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Ensure that the alpha value is between 0 and 1
  alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;

  // Create the RGBA string
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;

  return rgba;
};

export const rgbaToHex = (rgba: string) => {
  // Remove the hash symbol if it's present
  rgba = rgba.replaceAll(" ","").replace("rgba(", "").replace(")","");

  // Parse the hex values for red, green, and blue components
  const r = parseInt(rgba.split(",")[0]).toString(16).padStart(2, '0');
  const g = parseInt(rgba.split(",")[1]).toString(16).padStart(2, '0');
  const b = parseInt(rgba.split(",")[2]).toString(16).padStart(2, '0');

  // Ensure that the alpha value is between 0 and 1


  // Create the RGBA string
  const hex = `#${r}${g}${b}`;
 
  return hex;
};
