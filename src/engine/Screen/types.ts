import { CanvasType } from '../Canvas/types';

export interface ScreenPropType {
  canvasID: string;
  backgroundColor: string;
  width?: number;
  height?: number;
}

export interface ScreenType extends CanvasType {
  render: Function;
}
