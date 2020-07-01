export interface EngineType {
  startGame: Function;
}
export interface XYType {
  x: number;
  y: number;
}

export interface calcDistanceType {
  object: XYType;
  target: XYType;
}
export interface calcAngleType {
  cameraX: number;
  cameraY: number;
  cameraAngle: number;
  targetX: number;
  targetY: number;
}
