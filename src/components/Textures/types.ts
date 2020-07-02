import { SpriteType } from '../../engine/Sprite/types';

export interface TextureType {
  id: string;
  image: HTMLImageElement;
  horizontal: {
    clipX: number;
    clipY: number;
  };
  vertical: {
    clipX: number;
    clipY: number;
  };
  isWall: boolean;
  isObject: boolean;
  isCollidable: boolean;
  sprite?: SpriteType;
}

export interface TexturesType {
  get: Function;
}
