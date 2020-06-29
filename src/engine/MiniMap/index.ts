import { MiniMapPropType } from '../../types';

import { CanvasType } from '../Canvas/types';

const MiniMap = (canvas: CanvasType, config: MiniMapPropType) => {
  // Canvas relative size

  canvas.getCanvasDOM().style.width = config.relativeWidth + 'px';
  canvas.getCanvasDOM().style.height = config.relativeHeight + 'px';
  canvas.getCanvasDOM().style.opacity = config.opacity.toString();

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

export default MiniMap;
