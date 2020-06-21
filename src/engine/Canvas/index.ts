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
    drawRectangle(0, 0, width, height, backgroundColor);
  };

  // Draw a rectangle on canvas
  const drawRectangle = (x: number, y: number, width: number, height: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  };

  // Draw a line on canvas
  const drawLine = (x: number, y: number, toX: number, toY: number, color: string) => {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.stroke();
  };

  // Draw a circle on canvas
  const drawElipse = (x: number, y: number, radius: number, color: string) => {
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
  };
};

export default Canvas;
