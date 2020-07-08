export interface SpriteParamsType {
  x: number;
  y: number;
  image: string;
}

export interface SpriteType {
  render: Function;
  get: Function;
  calcDistance: Function;
}
