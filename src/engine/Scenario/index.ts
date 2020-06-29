import { MiniMapType } from '../MiniMap/types';
import { ScreenType } from '../Screen/types';
import { PlayerType } from '../Player/types';
import { ScenarioType } from '../../types';

import RayCasting from './RayCasting';

const Scenario = (
  player: PlayerType,
  canvasMiniMap: MiniMapType,
  canvasMiniMapDebug: MiniMapType,
  canvasScreen: ScreenType,
  config: ScenarioType
) => {
  const { tileSize, tilesX, tilesY, tiles, wallColor, floorColor } = config;

  const rayCasting = RayCasting(config, player, canvasMiniMap, canvasMiniMapDebug, canvasScreen);

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
        canvasMiniMap.canvas.drawRectangle({
          x: x0,
          y: y0,
          width: tileSize - 1,
          height: tileSize - 1,
          color: tileColor,
        });
        canvasMiniMapDebug.canvas.drawRectangle({
          x: x0,
          y: y0,
          width: tileSize - 1,
          height: tileSize - 1,
          color: tileColor,
        });
      });
    });
  };

  // Ray Casting
  const renderRays = () => {
    rayCasting.render();
  };

  // Render
  const render = (keysDown: any) => {
    canvasScreen.canvas.reset();
    canvasMiniMap.canvas.reset();
    canvasMiniMapDebug.canvas.reset();

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
