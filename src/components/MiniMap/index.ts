import { MiniMapPropType } from '../../types';

import Canvas from '../../engine/Canvas';

class MiniMap extends Canvas {
  constructor(config: MiniMapPropType) {
    super(config);

    // Canvas relative size
    this.canvas.style.width = config.relativeWidth + 'px';
    this.canvas.style.height = config.relativeHeight + 'px';
    this.canvas.style.opacity = config.opacity.toString();
  }

  // Render
  render = () => {
    this.reset();
  };
}

export default MiniMap;
