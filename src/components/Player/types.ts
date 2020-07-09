export interface PlayerType {
  render: Function;
  postRender: Function;
  get: Function;
}

export interface PlayerPropsType {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  turnSpeed: number;
  fieldOfView: number;
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
