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
    fps: 60,
    depthfOfField: 3000,
    render: {
        wallPixelWidth: 1,
        light: 40,
        fogImage,
    },
};
exports.scenario = {
    tileSize: 64,
    tilesX: 15,
    tilesY: 40,
    tiles: map_1.default,
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
    width: 400,
    height: 350,
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
    x: exports.miniMapAllRays.width / 2 + 50,
    y: exports.miniMapAllRays.height / 2,
    width: exports.scenario.tileSize / 2.5,
    height: exports.scenario.tileSize / 2.5,
    color: '#FFFF00',
    speed: 1,
    turnSpeed: 0.03,
    fieldOfView: 60,
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
