import { MiniMapPropType } from '../../types';

import Canvas from '../../engine/Canvas';

class Screen extends Canvas {
  constructor(config: CanvasType) {
    super(config);
  }

  // Render
  render = () => {
    this.reset();
  };
}

export default Screen;
