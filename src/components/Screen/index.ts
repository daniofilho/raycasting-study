import { ScreenPropType } from './types';

import Canvas from '../../engine/Canvas';

class Screen extends Canvas {
  constructor(config: ScreenPropType) {
    super(config);
  }

  // Render
  render = () => {
    this.reset();
  };
}

export default Screen;
