export interface castType {
  rayAngle: number;
}
export interface renderRayType {
  rayX: number;
  rayY: number;
}
export interface debugSingleRayType {
  toX: number;
  toY: number;
  color: string;
}
export interface render3DType {
  distance: number;
  index: number;
  rayAngle: number;
  objectId: number;
  pixelOfTexture: number;
  horizontalRay: boolean;
}
export interface renderObjectsType {
  rayX: number;
  rayY: number;
  rayAngle: number;
  distance: number;
  rayNumber: number;
  pixelOfTexture: number;
  objectId: number;
  horizontalRay: boolean;
}
export interface renderObject {
  objectId: number;
  pixelOfTexture: number;
  wallWidth: number;
  wallHeight: number;
  wallX: number;
  wallY: number;
  horizontalRay: boolean;
  alpha: number;
}
