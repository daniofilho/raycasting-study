import { CanvasType } from '../Canvas/types';

export interface ScreenType {
  get: Function;
  render: Function;
  canvas: CanvasType;
}
