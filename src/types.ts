/* CONFIG */

export interface GameType {
  fps: number;
  depthfOfField: number;
  render: {
    line: {
      maxHeight: number;
    };
  };
}

export interface ScenarioType {
  tileSize: number;
  tilesX: number;
  tilesY: number;
  tiles: Array<number>;
  wallColor: string;
  floorColor: string;
}

export interface CanvasPropType {
  canvasID: string;
  backgroundColor: string;
  width: number;
  height: number;
}

export interface ScreenPropType {
  canvasID: string;
  backgroundColor: string;
  width: number;
  height: number;
}

export interface MiniMapPropType {
  canvasID: string;
  backgroundColor: string;
  opacity: number;
  width: number;
  height: number;
  relativeHeight: number;
  relativeWidth: number;
  x: number;
  y: number;
}

export interface PlayerPropsType {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  turnSpeed: number;
  fieldOfView: number;
}
