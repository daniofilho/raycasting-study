import { MiniMapType } from '../MiniMap/types';
import { ScreenType } from '../Screen/types';
import { PlayerType } from '../Player/types';
import { ScenarioPropType } from './types';
import { TexturesType, TextureType } from '../Textures/types';

import RayCasting from './RayCasting';

const Scenario = (
  player: PlayerType,
  canvasMiniMap: MiniMapType,
  canvasMiniMapDebug: MiniMapType,
  canvasScreen: ScreenType,
  config: ScenarioPropType,
  textures: TexturesType
) => {
  const { tileSize, tilesX, tilesY, map } = config;

  const getConfig = (prop: string) => {
    return config[prop];
  };
  const getConfigs = () => {
    return config;
  };

  const rayCasting = RayCasting(
    config,
    player,
    canvasMiniMap,
    canvasMiniMapDebug,
    canvasScreen,
    textures
  );
  rayCasting.setup();

  // Tiles
  const renderMiniMaps = () => {
    // Loop tiles
    new Array(tilesY).fill('').forEach((_, y) => {
      new Array(tilesX).fill('').forEach((_, x) => {
        const x0 = x * tileSize;
        const y0 = y * tileSize;

        const objectTexture: TextureType = textures.get(map[y][x]);

        // Minimap
        canvasMiniMap.drawImage({
          image: objectTexture.image,
          x: x0,
          y: y0,
          width: tileSize,
          height: tileSize,
          clipX: 0,
          clipY: 0,
          clipWidth: tileSize,
          clipHeight: tileSize,
        });
        canvasMiniMapDebug.drawImage({
          image: objectTexture.image,
          x: x0,
          y: y0,
          width: tileSize,
          height: tileSize,
          clipX: 0,
          clipY: 0,
          clipWidth: tileSize,
          clipHeight: tileSize,
        });
      });
    });
  };

  // Ray Casting
  const renderScreen = () => {
    canvasScreen.render();
    rayCasting.render();
  };

  // Render
  const render = () => {
    canvasMiniMap.render();
    canvasMiniMapDebug.render();

    renderMiniMaps();

    renderScreen();
  };

  // Return all public functions
  return {
    render,
    getConfig,
    getConfigs,
  };
};

export default Scenario;
