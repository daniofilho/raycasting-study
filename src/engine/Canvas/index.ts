import * as config from '../../config';

class Canvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvasID: string) {
    let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    let context = canvas.getContext('2d');

    this.canvas = canvas;
    this.context = context;

    this.run();
  }

  // Initialize class
  private run() {
    const { width, height, backgroundColor } = config.canvas;

    // Canvas Size
    let canvas = this.canvas;
    canvas.width = width;
    canvas.height = height;

    // Canvas Background color
    this.drawRect(0, 0, width, height, backgroundColor);
  }

  // Draw a rectangle on canvas
  public drawRect(x: number, y: number, width: number, height: number, color: string) {
    let context = this.context;

    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.clearRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
  }
}

export default Canvas;
