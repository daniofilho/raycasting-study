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
  fillColor?: string;
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
  opacity?: number;
  filter?: string | boolean;
}

export interface CanvasPropType {
  canvasID: string;
  backgroundColor: string;
  width?: number;
  height?: number;
}

export interface CanvasType {
  drawRectangle(args: drawRectangleType): void;
  drawLine(args: drawLineType): void;
  drawElipse(args: drawElipseType): void;
  drawText(args: drawTextType): void;
  drawImage(args: drawImageType): void;
  get(prop: string): any;
  getConfig(prop: string): any;
  createLineGradient(color1: string, color2: string): string;
  createPattern(img: HTMLImageElement): string;
  reset: Function;
  getContext: Function;
}
