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

export interface CanvasType {
  reset: Function;
  drawRectangle: Function;
  drawLine: Function;
  drawElipse: Function;
  drawText: Function;
  get: Function;
  getConfig: Function;
  getContext: Function;
  createLineGradient: Function;
  createPattern: Function;
}
