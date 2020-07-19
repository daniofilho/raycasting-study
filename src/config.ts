import * as Types from 'types';

import { ScenarioPropType } from './engine/Scenario/types';
import { ScreenPropType } from './components/Screen/types';
import { MiniMapPropType } from './components/MiniMap/types';
import { PlayerPropsType } from './components/Player/types';

import { map, mapWidth, mapHeight } from './map';

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

export const game: Types.GameType = {
  fps: 30,
  depthfOfField: 3000,
  render: {
    wallPixelWidth: 1, // the higher value, the more pixelated the walls will be
    light: 40,
    fogImage,
  },
};

export const scenario: ScenarioPropType = {
  tileSize: 64,
  tilesX: mapWidth,
  tilesY: mapHeight,
  map,
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

export const screen: ScreenPropType = {
  canvasID: 'screen',
  backgroundColor: '#333333',
  width: 300,
  height: 220,
};

export const miniMapSingleRay: MiniMapPropType = {
  canvasID: 'minimap_singleRay',
  backgroundColor: '#000',
  opacity: 1,
  width: scenario.tilesX * scenario.tileSize,
  height: scenario.tilesY * scenario.tileSize,
  relativeWidth: 500,
  relativeHeight: 500,
  x: screen.width - 100,
  y: screen.height - 100,
};

export const miniMapAllRays: MiniMapPropType = {
  canvasID: 'minimap_allRays',
  backgroundColor: '#000',
  opacity: 1,
  width: scenario.tilesX * scenario.tileSize,
  height: scenario.tilesY * scenario.tileSize,
  relativeWidth: 290,
  relativeHeight: 317,
  x: screen.width - 100,
  y: screen.height - 100,
};

export const player: PlayerPropsType = {
  x: 350,
  y: 725,
  pod: 0,
  fov: 90 * (Math.PI / 180),
  size: 15,
  /*width: scenario.tileSize / 2.5,
  height: scenario.tileSize / 2.5,
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
  },*/
};
