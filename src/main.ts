import Canvas from './engine/Canvas';

import * as config from './config';

// Declarations
const MyCanvas = new Canvas('screen');

// Init
const drawPlayer = (x: number, y: number) => {
  const { width, height, color } = config.player;
  MyCanvas.drawRect(x, y, width, height, color);
};
drawPlayer(config.player.x, config.player.y);
