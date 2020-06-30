import { CanvasPropType } from '../../types';

import { drawElipseType, drawLineType, drawRectangleType, drawTextType } from './types';

class Canvas {
  canvas: HTMLCanvasElement;
  context: any;
  config: CanvasPropType;

  constructor(config: CanvasPropType) {
    this.canvas = document.getElementById(config.canvasID) as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');

    this.config = config;

    // Canvas Size
    const { width, height } = config;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  // Get some prop
  get = (prop: string) => {
    return this.canvas[prop];
  };

  getConfig = () => {
    return this.config;
  };

  getContext = () => {
    return this.context;
  };

  // Reset canvas
  reset = () => {
    const { width, height, backgroundColor } = this.config;
    // Background
    this.drawRectangle({ x: 0, y: 0, width, height, color: backgroundColor });
  };

  // Create a Line Gradient
  createLineGradient = (color1: string, color2: string) => {
    const grd = this.context.createLinearGradient(0, 0, 0, 600);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);

    return grd;
  };

  // Create a texture pattern
  createPattern = (elementID: string) => {
    const img = document.getElementById(elementID);
    return this.context.createPattern(img, 'no-repeat');
  };

  // Draw a text
  drawText = ({ text, x, y, color = '#000', size = 20, align = 'left' }: drawTextType) => {
    const { context } = this;

    context.font = `${size}px Arial`;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(text, x, y);
  };

  // Draw a rectangle on canvas
  drawRectangle = ({ x, y, width, height, color }: drawRectangleType) => {
    const { context } = this;

    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  };

  // Draw a line on canvas
  drawLine = ({ x, y, toX, toY, color }: drawLineType) => {
    const { context } = this;

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.stroke();
  };

  // Draw a circle on canvas
  drawElipse = ({ x, y, radius, color = '#FFF' }: drawElipseType) => {
    const { context } = this;

    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
  };
}

export default Canvas;
