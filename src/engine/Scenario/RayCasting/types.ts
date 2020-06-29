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
  playerX: number;
  playerY: number;
  isRayFacingDown: boolean;
  isRayFacingUp: boolean;
  isRayFacingRight: boolean;
  isRayFacingLeft: boolean;
}
export interface renderRayType {
  rayX: number;
  rayY: number;
}
