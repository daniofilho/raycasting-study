export interface TextureType {
  id: string;
  image: HTMLImageElement;
  isWall: boolean;
  isObject: boolean;
  isCollidable: boolean;
  isLight: boolean;
}

export interface TexturesType {
  get(id: string): TextureType;
}
