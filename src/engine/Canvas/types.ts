export interface drawTextType {
  text: string;
  x: number;
  y: number;
  color?: string;
  size?: number;
  align?: CanvasTextAlign;
}

export interface drawRectangleType {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface drawLineType {
  x: number;
  y: number;
  toX: number;
  toY: number;
  color: string;
}

export interface drawElipseType {
  x: number;
  y: number;
  radius: number;
  color?: string;
}

export interface drawImageType {
  image: HTMLImageElement;
  clipX?: number;
  clipY?: number;
  clipWidth?: number;
  clipHeight?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasPropType {
  canvasID: string;
  backgroundColor: string;
  width?: number;
  height?: number;
}

export interface CanvasType {
  reset: Function;
  getContext: Function;
  drawRectangle(args: drawRectangleType): Function;
  drawLine(args: drawLineType): Function;
  drawElipse(args: drawElipseType): Function;
  drawText(args: drawTextType): Function;
  drawImage(args: drawImageType): Function;
  get(prop: string): any;
  getConfig(prop: string): any;
  createLineGradient(color1: string, color2: string): Function;
  createPattern(img: HTMLImageElement): Function;
}
