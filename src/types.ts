/* CONFIG */

export interface GameType {
  fps: number;
  depthfOfField: number;
  gravity: number;
  render: {
    wallPixelWidth: number;
    light: number;
    fogImage: HTMLImageElement;
    wallHeight: number;
  };
}

export interface rgbType {
  r: number;
  g: number;
  b: number;
}
