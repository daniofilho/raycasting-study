import { CanvasType } from '../Canvas/types';
import { PlayerType } from '../Player/types';
import { ScenarioType } from '../../types';

import RayCasting from './RayCasting';

const Scenario = (
  player: PlayerType,
  canvasMiniMap: CanvasType,
  canvasScreen: CanvasType,
  config: ScenarioType
) => {
  const { tileSize, tilesX, tilesY, tiles, wallColor, floorColor } = config;

  const rayCasting = RayCasting();

  // Tiles
  const renderTiles = () => {
    // Loop tiles
    new Array(tilesX).fill('').forEach((_, x) => {
      new Array(tilesY).fill('').forEach((_, y) => {
        const x0 = x * tileSize;
        const y0 = y * tileSize;

        // Define tile color based on tile value (0,1)
        const tileColor = tiles[y * tilesX + x] === 1 ? wallColor : floorColor;

        // Minimap
        canvasMiniMap.drawRectangle(x0, y0, tileSize - 1, tileSize - 1, tileColor);
      });
    });
  };

  // Ray Casting
  const renderRays = () => {};

  // Render
  const render = (keysDown: any) => {
    canvasScreen.reset();
    canvasMiniMap.reset();

    renderTiles();

    renderRays();

    player.render(keysDown);
  };

  // Return all public functions
  return {
    render,
  };
};

export default Scenario;
