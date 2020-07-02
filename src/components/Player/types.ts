export interface PlayerType {
  render: Function;
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
}
