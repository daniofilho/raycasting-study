import * as Types from 'types';

export const game: Types.GameType = {
  fps: 60,
  depthfOfField: 10,
  render: {
    light: 40,
    wall: {
      width: 3,
    },
  },
};

export const scenario: Types.ScenarioType = {
  tileSize: 32,
  tilesX: 9,
  tilesY: 9,
  // prettier-ignore
  /*tiles: [
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],*/
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
  relativeWidth: 250,
  relativeHeight: 250,
  x: screen.width - 100,
  y: screen.height - 100,
};
export const miniMapAllRays: Types.MiniMapPropType = {
  canvasID: 'minimap_allRays',
  backgroundColor: '#000',
  opacity: 1,
  width: scenario.tilesX * scenario.tileSize,
  height: scenario.tilesY * scenario.tileSize,
  relativeWidth: 250,
  relativeHeight: 250,
  x: screen.width - 100,
  y: screen.height - 100,
};

export const player: Types.PlayerPropsType = {
  x: miniMapAllRays.width / 2,
  y: miniMapAllRays.height / 2,
  width: scenario.tileSize / 2.5,
  height: scenario.tileSize / 2.5,
  color: '#FFFF00',
  speed: 0.3,
  turnSpeed: 0.03,
  fieldOfView: 60,
};
