import * as Types from 'types';

export const game: Types.GameType = {
  fps: 60,
  depthfOfField: 8,
};

export const scenario: Types.ScenarioType = {
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

export const screen: Types.ScreenPropType = {
  canvasID: 'screen',
  backgroundColor: '#333333',
  width: 800,
  height: 600,
};

export const miniMap: Types.MiniMapPropType = {
  canvasID: 'minimap',
  backgroundColor: '#000',
  opacity: 0.5,
  width: scenario.tilesX * scenario.tileSize,
  height: scenario.tilesY * scenario.tileSize,
  relativeWidth: 800, //150,
  relativeHeight: 800, //150,
  x: screen.width - 100,
  y: screen.height - 100,
};

export const player: Types.PlayerPropsType = {
  x: miniMap.width / 2,
  y: miniMap.height / 2,
  width: scenario.tileSize / 2.5,
  height: scenario.tileSize / 2.5,
  color: '#FFFF00',
  speed: 0.3,
  fieldOfView: 60,
};
