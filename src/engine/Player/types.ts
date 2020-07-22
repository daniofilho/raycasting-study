export interface PlayerType {
  render: Function;
  postRender: Function;
  get: Function;
}

export interface PlayerPropsType {
  x: number;
  y: number;
  pod: number;
  fov: number;
  size: number;
  speed: number;
  turnSpeed: number;
  jumpSpeed: number;
  crosshair: {
    image: HTMLImageElement;
    width: number;
    height: number;
  };
  gun: {
    image: HTMLImageElement;
    width: number;
    height: number;
  };
}
