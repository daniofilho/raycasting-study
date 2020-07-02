import { CanvasType } from '../../engine/Canvas/types';

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

export interface MiniMapType extends CanvasType {
  render: Function;
}
