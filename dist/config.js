"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMapAllRays = exports.miniMapSingleRay = exports.screen = exports.scenario = exports.game = void 0;
const map_1 = require("./map");
const fogImage = new Image();
fogImage.src = 'assets/sky.png';
const skyImg = new Image();
skyImg.src = 'assets/sky.png';
const floorImg = new Image();
floorImg.src = 'assets/floor.png';
const crosshairImg = new Image();
crosshairImg.src = 'assets/crosshair.png';
const gunImg = new Image();
gunImg.src = 'assets/gun.gif';
exports.game = {
    fps: 30,
    depthfOfField: 3000,
    gravity: 1.7,
    render: {
        wallPixelWidth: 1,
        light: 40,
        fogImage,
        wallHeight: 1100,
    },
};
exports.scenario = {
    tileSize: 64,
    tilesX: map_1.mapWidth,
    tilesY: map_1.mapHeight,
    map: map_1.map,
    minimap: {
        wall: { color: '#008800' },
        floor: { color: '#707070' },
    },
    screen: {
        sky: {
            color: { r: 44, g: 44, b: 44 },
            image: skyImg,
        },
        floor: {
            color: {
                from: '#505050',
                to: '#707070',
            },
            image: floorImg,
        },
    },
};
exports.screen = {
    canvasID: 'screen',
    backgroundColor: '#333333',
    width: 1024,
    height: 768,
};
exports.miniMapSingleRay = {
    canvasID: 'minimap_singleRay',
    backgroundColor: '#000',
    opacity: 1,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeWidth: 290,
    relativeHeight: 317,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.miniMapAllRays = {
    canvasID: 'minimap_allRays',
    backgroundColor: '#000',
    opacity: 1,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeWidth: 290,
    relativeHeight: 317,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.player = {
    x: 350,
    y: 725,
    pod: 45,
    fov: 90,
    size: exports.scenario.tileSize / 2.5,
    speed: 10,
    turnSpeed: 2,
    jumpSpeed: 6,
    crosshair: {
        image: crosshairImg,
        width: 10,
        height: 10,
    },
    gun: {
        image: gunImg,
        width: 200,
        height: 255,
    },
};
//# sourceMappingURL=config.js.map