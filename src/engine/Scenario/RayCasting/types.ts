import { TextureType } from '../../Textures/types';

export interface wallType {
  distance: number;
  texture: string;
  textureX: number;
  shadow: boolean;
  rayX: number;
  rayY: number;
}

export interface objectType {
  texture: TextureType;
  x: number;
  y: number;
}

export interface objectToDrawType {
  distance: number;
  angle: number;
  viewDist: number;
  size: number;
  props: objectType;
}
