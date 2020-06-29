import { CanvasPropType } from '../../types';

const Canvas = (config: CanvasPropType) => {
  // Constructor
  const canvas = document.getElementById(config.canvasID) as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  // Canvas Size
  const { width, height } = config;
  canvas.width = width;
  canvas.height = height;

  // Get some prop
  const get = (prop: string) => {
    return canvas[prop];
  };

  const getConfig = () => {
    return config;
  };

  const getContext = () => {
    return context;
  };

  const getCanvasDOM = () => {
    return canvas;
  };

  // Reset canvas
  const reset = () => {
    const { width, height, backgroundColor } = config;
    // Background
    drawRectangle({ x: 0, y: 0, width, height, color: backgroundColor });
  };

  // Draw a text
  interface drawTextType {
    text: string;
    x: number;
    y: number;
    color?: string;
    size?: number;
    align?: CanvasTextAlign;
  }
  const drawText = ({ text, x, y, color = '#000', size = 20, align = 'left' }: drawTextType) => {
    context.font = `${size}px Arial`;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(text, x, y);
  };

  // Draw a rectangle on canvas
  interface drawRectangleType {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }
  const drawRectangle = ({ x, y, width, height, color }: drawRectangleType) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  };

  // Draw a line on canvas
  interface drawLineType {
    x: number;
    y: number;
    toX: number;
    toY: number;
    color: string;
  }
  const drawLine = ({ x, y, toX, toY, color }: drawLineType) => {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.stroke();
  };

  // Draw a circle on canvas
  interface drawElipseType {
    x: number;
    y: number;
    radius: number;
    color?: string;
  }
  const drawElipse = ({ x, y, radius, color = '#FFF' }: drawElipseType) => {
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
  };

  // Return all public functions
  return {
    reset,
    get,
    getConfig,
    getContext,
    getCanvasDOM,
    drawRectangle,
    drawLine,
    drawElipse,
    drawText,
  };
};

export default Canvas;
