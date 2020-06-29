import { CanvasType } from '../Canvas/types';

const Screen = (canvas: CanvasType) => {
  // Get some prop
  const get = (prop: string) => {
    return canvas.get(prop);
  };

  // Render
  const render = () => {
    canvas.reset();
  };

  // Return all public functions
  return {
    get,
    render,
    canvas,
  };
};

export default Screen;
