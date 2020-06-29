import { CanvasType } from '../Canvas/types';

export interface MiniMapType {
  get: Function;
  render: Function;
  canvas: CanvasType;
}
