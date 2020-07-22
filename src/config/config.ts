import * as Types from 'types';

import { ScenarioPropType } from '../engine/Scenario/types';
import { ScreenPropType } from '../engine/Screen/types';
import { MiniMapPropType } from '../engine/MiniMap/types';
import { PlayerPropsType } from '../engine/Player/types';

import * as InitialMap from './map';

const skyImg = new Image();
skyImg.src = 'assets/sky.jpg';

const crosshairImg = new Image();
crosshairImg.src = 'assets/crosshair.png';

const gunImg = new Image();
gunImg.src = 'assets/gun.gif';

export const screen: ScreenPropType = {
  canvasID: 'screen',
  backgroundColor: '#333333',
  width: 500,
  height: 375,
};

export const scenario: ScenarioPropType = {
  tileSize: 64,
  tilesX: InitialMap.map.width,
  tilesY: InitialMap.map.height,
  map: InitialMap.map.tiles,
  screen: {
    sky: {
      image: skyImg,
      width: screen.width,
      height: screen.height,
    },
  },
};

export const game: Types.GameType = {
  fps: 60,
  gravity: 1.7,
  render: {
    wallHeight: screen.height * 1.1, // 1100
    maxDistanceVisible: 20,
  },
};

export const miniMapSingleRay: MiniMapPropType = {
  canvasID: 'minimap_singleRay',
  backgroundColor: '#000',
  opacity: 1,
  width: scenario.tilesX * scenario.tileSize,
  height: scenario.tilesY * scenario.tileSize,
  relativeWidth: 290,
  relativeHeight: 317,
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
  x: InitialMap.player.x * scenario.tileSize,
  y: InitialMap.player.y * scenario.tileSize,
  pod: InitialMap.player.pod, // Direction player is look ( 0 - 360 )
  fov: 90, // Field of view
  size: scenario.tileSize / 2.5,
  speed: 10,
  turnSpeed: 2,
  jumpSpeed: 8,
  crosshair: {
    image: crosshairImg,
    width: 10,
    height: 10,
  },
  gun: {
    image: gunImg,
    width: screen.width / 2,
    height: screen.width / 2,
  },
};
