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
}

export interface TexturesType {
  get: Function;
}
