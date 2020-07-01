import * as Types from 'types';

import map from './map';

export const game: Types.GameType = {
  fps: 60,
  depthfOfField: 50,
  render: {
    light: 40,
  },
};

export const scenario: Types.ScenarioType = {
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
      image: 'sky',
    },
    floor: {
      color: {
        from: '#505050',
        to: '#707070',
      },
    },
  },
};

export const screen: Types.ScreenPropType = {
  canvasID: 'screen',
  backgroundColor: '#333333',
  width: 800,
  height: 600,
};

export const miniMapSingleRay: Types.MiniMapPropType = {
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

export const miniMapAllRays: Types.MiniMapPropType = {
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

export const player: Types.PlayerPropsType = {
  x: miniMapAllRays.width / 2,
  y: miniMapAllRays.height / 2,
  width: scenario.tileSize / 2.5,
  height: scenario.tileSize / 2.5,
  color: '#FFFF00',
  speed: 2,
  turnSpeed: 0.05,
  fieldOfView: 60,
};
