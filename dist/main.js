"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./engine/Canvas");
const config = require("./config");
// Declarations
const MyCanvas = new Canvas_1.default('screen');
// Init
const drawPlayer = (x, y) => {
    const { width, height, color } = config.player;
    MyCanvas.drawRect(x, y, width, height, color);
};
drawPlayer(config.player.x, config.player.y);
