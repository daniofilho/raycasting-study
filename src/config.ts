import * as Types from 'types';

import { ScenarioPropType } from './engine/Scenario/types';
import { ScreenPropType } from './components/Screen/types';
import { MiniMapPropType } from './components/MiniMap/types';
import { PlayerPropsType } from './components/Player/types';

import map from './map';

const fogImage = new Image();
fogImage.src = 'assets/sky.png';
export const game: Types.GameType = {
  fps: 60,
  depthfOfField: 1450,
  render: {
    light: 40,
    fogImage,
  },
};

const skyImg = new Image();
skyImg.src = 'assets/sky.png';
export const scenario: ScenarioPropType = {
  tileSize: 64,
  tilesX: 15,
  tilesY: 19,
  // prettier-ignore
  tiles: map,
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
        from: '#000',
        to: '#707070',
      },
    },
  },
};

export const screen: ScreenPropType = {
  canvasID: 'screen',
  backgroundColor: '#333333',
  width: 300,
  height: 230,
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
  x: miniMapAllRays.width / 2 + 50,
  y: miniMapAllRays.height / 2,
  width: scenario.tileSize / 2.5,
  height: scenario.tileSize / 2.5,
  color: '#FFFF00',
  speed: 1,
  turnSpeed: 0.03,
  fieldOfView: 60, // DONT CHANGE, IF YOU DO, SPRITES WILL DISAPPEAR :/
};
