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
}

export interface TexturesType {
  get: Function;
}
