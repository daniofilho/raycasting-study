class Canvas {
  //private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvasID: string) {
    let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    let context = canvas.getContext('2d');

    //this.canvas = canvas;
    this.context = context;
  }

  public drawRect(x: number, y: number, width: number, height: number) {
    let context = this.context;

    context.fillRect(x, y, width, height);
    context.clearRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
  }
}

export default Canvas;
