/* CONFIG */

export interface GameType {
  fps: number;
  depthfOfField: number;
  render: {
    light: number;
    fogImage: HTMLImageElement;
  };
}

export interface rgbType {
  r: number;
  g: number;
  b: number;
}
