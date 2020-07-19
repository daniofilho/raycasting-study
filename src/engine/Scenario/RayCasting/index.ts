import { MiniMapType } from '../../../components/MiniMap/types';
import { ScreenType } from '../../../components/Screen/types';
import { PlayerType } from '../../../components/Player/types';
import { ScenarioPropType } from '../../Scenario/types';
import { TexturesType, TextureType } from '../../../components/Textures/types';

import {
  castType,
  renderRayType,
  debugSingleRayType,
  render3DType,
  renderListType,
  renderWallType,
} from './types';

import * as config from '../../../config';

import { normalizeAngle, calcDistance } from '../../calculations';

const RayCasting = (
  scenario: ScenarioPropType,
  player: PlayerType,
  canvasMinimap: MiniMapType,
  canvasMiniMapDebug: MiniMapType,
  canvasScreen: ScreenType,
  textures: TexturesType
) => {
  const { map, tilesX, tilesY, tileSize } = scenario;

  const props = {
    dof: config.game.depthfOfField,
    fov: player.get('fov'), // field of view
    zIndex: [],
    resolution: 1,
    podDistance: 0,
  };

  const canvasWidth = canvasScreen.getConfig().width;
  const canvasHeight = canvasScreen.getConfig().height;

  interface wallType {
    distance: number;
    texture: string;
    textureX: number;
    shadow: boolean;
  }

  const renderWall = (x: number, wall: wallType) => {
    let size = 1200 / wall.distance;
    let texture = textures.get(wall.texture);
    let textureX = Math.floor((texture.width / 50) * wall.textureX);
    let jump = (player.get('jump') * 10) / wall.distance;
    let y = canvasHeight / 2 - size / 2 + player.get('look') + jump;

    canvasScreen.drawImage({
      image: texture.image,
      clipX: textureX,
      clipY: 0,
      clipWidth: 1,
      clipHeight: texture.height,
      x,
      y,
      width: 1,
      height: size,
    });

    /*if (wall.shadow) {
      ctx.fillStyle = this.texture.colors.shadow;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(x, y, 1, size);
      ctx.globalAlpha = 1;
    }*/

    //this.renderGround(x, y + size);
  };

  const castWall = (angle: number) => {
    const PI2 = Math.PI * 2;
    angle %= PI2;

    if (angle < 0) {
      angle += PI2;
    }

    const { tilesX, tilesY, map } = config.scenario;

    const playerX = player.get('x');
    const playerY = player.get('y');

    const right = angle > PI2 * 0.75 || angle < PI2 * 0.25;
    const up = angle < 0 || angle > Math.PI;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const px = playerX / 50;
    const py = playerY / 50;

    let shadow = false;

    let dist = 0;
    let textureX;
    let texture;

    let slope = sin / cos;
    let dXVer = right ? 1 : -1;
    let dYVer = dXVer * slope;

    let x = right ? Math.ceil(px) : Math.floor(px);
    let y = py + (x - px) * slope;

    // Horizontal Ray
    while (x >= 0 && x < tilesX && y >= 0 && y < tilesY) {
      let wallX = Math.floor(x + (right ? 0 : -1));
      let wallY = Math.floor(y);

      if (map[wallY][wallX] !== 'floor') {
        dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
        texture = map[wallY][wallX];
        textureX = (y * 50) % 50;

        if (!right) {
          textureX = 50 - textureX;
          shadow = true;
        }
        break;
      }
      x += dXVer;
      y += dYVer;
    }

    slope = cos / sin;

    let dYHor = up ? -1 : 1;
    let dXHor = dYHor * slope;

    y = up ? Math.floor(py) : Math.ceil(py);
    x = px + (y - py) * slope;

    // Vertical Ray
    while (x >= 0 && x < tilesX && y >= 0 && y < tilesY) {
      let wallY = Math.floor(y + (up ? -1 : 0));
      let wallX = Math.floor(x);

      if (map[wallY][wallX] !== 'floor') {
        let distHor = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));

        if (dist === 0 || distHor < dist) {
          shadow = true;
          dist = distHor;
          texture = map[wallY][wallX];
          textureX = (x * 50) % 50;

          if (!up) {
            shadow = false;
            //textureX = 50 - textureX;
          }
        }
        break;
      }
      x += dXHor;
      y += dYHor;
    }

    props.zIndex.push(dist);
    dist *= Math.cos(player.get('pod') * (Math.PI / 180) - angle);

    return {
      distance: dist,
      texture: texture,
      textureX: textureX,
      shadow: shadow,
    };
  };

  const renderWalls = () => {
    props.zIndex = [];

    const pod = player.get('pod');

    let resolution = Math.ceil(canvasWidth / props.resolution);

    for (let x = 0; x < resolution; x++) {
      let viewDist = canvasWidth / props.resolution / Math.tan(props.fov / 2);
      let rayx = (-resolution / 2 + x) * props.resolution;
      let rayDist = Math.sqrt(rayx * rayx + viewDist * viewDist);
      let rayAngle = Math.asin(rayx / rayDist);

      let wall = castWall(pod * (Math.PI / 180) + rayAngle);
      if (x === resolution / 2) {
        props.podDistance = wall.distance;
      }
      renderWall(x, wall);
    }
  };

  // Render everything
  const render = () => {
    renderWalls();
  };

  return {
    render,
  };
};

export default RayCasting;
