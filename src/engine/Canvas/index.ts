import {
  CanvasPropType,
  drawElipseType,
  drawLineType,
  drawRectangleType,
  drawTextType,
  drawImageType,
} from './types';

class Canvas {
  canvas: HTMLCanvasElement;
  context: any;
  config: CanvasPropType;

  constructor(config: CanvasPropType) {
    this.canvas = document.getElementById(config.canvasID) as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');

    this.config = config;
  }

  set = (prop: any, value: any) => {
    this.canvas[prop] = value;
  };

  // Get some prop
  get = (prop: string) => {
    return this.canvas[prop];
  };

  getConfig = (prop: string) => {
    return this.config[prop];
  };

  getContext = () => {
    return this.context;
  };

  // Reset canvas
  reset = () => {
    const { width, height, backgroundColor } = this.config;

    this.canvas.width = width;
    this.canvas.height = height;

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
  createPattern = (img: HTMLImageElement) => {
    return this.context.createPattern(img, 'repeat');
  };

  // Draw a text
  drawText = ({ text, x, y, color = '#000', size = 20, align = 'left' }: drawTextType) => {
    const { context } = this;

    this.context.restore();

    context.font = `${size}px Arial`;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(text, x, y);

    return context;
  };

  // Draw a rectangle on canvas
  drawRectangle = ({ x, y, width, height, color }: drawRectangleType) => {
    const { context } = this;

    this.context.restore();

    context.fillStyle = color;
    context.fillRect(x, y, width, height);

    return context;
  };

  // Draw a line on canvas
  drawLine = ({ x, y, toX, toY, color }: drawLineType) => {
    const { context } = this;

    this.context.restore();

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.stroke();

    return context;
  };

  // Draw a circle on canvas
  drawElipse = ({ x, y, radius, color = '#FFF', fillColor = 'rgba(0,0,0,0)' }: drawElipseType) => {
    const { context } = this;

    this.context.restore();

    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = fillColor;
    context.fill();
    context.stroke();

    return context;
  };

  // Draw an image on Canvas
  doDrawImage = ({
    image,
    x,
    y,
    width,
    height,
    clipX,
    clipY,
    clipWidth,
    clipHeight,
    opacity = 1,
  }: drawImageType) => {
    if (clipWidth && clipHeight) {
      return this.context.drawImage(
        image,
        clipX,
        clipY,
        clipWidth,
        clipHeight,
        x,
        y,
        width,
        height
      );
    }

    this.context.drawImage(image, x, y, width, height);
  };
  drawImage = (params: drawImageType) => {
    const { filter } = params;

    this.context.restore();

    this.context.imageSmoothingEnabled = false; // Pixelate image

    // Will draw with filter?
    if (filter) this.context.filter = filter;

    this.doDrawImage(params);

    // Reset filter
    if (filter) this.context.filter = 'none';

    return this.context;
  };
}

export default Canvas;
