export interface XYType {
  x: number;
  y: number;
}
export interface calcDistanceType {
  object: XYType;
  target: XYType;
}
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
}
