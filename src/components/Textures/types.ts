import { SpriteType } from '../../engine/Sprite/types';

export interface TextureType {
  id: string;
  image: HTMLImageElement;
  isWall: boolean;
  isObject: boolean;
  isCollidable: boolean;
  sprite?: SpriteType;
}

export interface TexturesType {
  get(id: string): TextureType;
}
