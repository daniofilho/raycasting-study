"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMap = exports.screen = exports.scenario = exports.game = void 0;
exports.game = {
    fps: 60,
    depthfOfField: 8,
};
exports.scenario = {
    tileSize: 32,
    tilesX: 9,
    tilesY: 9,
    // prettier-ignore
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 0, 0, 1, 1, 0, 1,
        1, 0, 1, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    wallColor: '#008800',
    floorColor: 'rgba(0,0,0,0.5)',
};
exports.screen = {
    canvasID: 'screen',
    backgroundColor: '#333333',
    width: 800,
    height: 600,
};
exports.miniMap = {
    canvasID: 'minimap',
    backgroundColor: '#000',
    opacity: 0.5,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeWidth: 800,
    relativeHeight: 800,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.player = {
    x: exports.miniMap.width / 2,
    y: exports.miniMap.height / 2,
    width: exports.scenario.tileSize / 2.5,
    height: exports.scenario.tileSize / 2.5,
    color: '#FFFF00',
    speed: 0.3,
    fieldOfView: 60,
};
