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

  const canvasWidth = canvasScreen.getConfig('width');
  const canvasHeight = canvasScreen.getConfig('height');

  interface wallType {
    distance: number;
    texture: string;
    textureX: number;
    shadow: boolean;
  }

  // # Wall - - - - - - - - - - - - - - - - - - - - - - - -

  const renderWall = (x: number, wall: wallType) => {
    // Wall props
    let size = config.game.render.wallHeight / wall.distance;
    let texture = textures.get(wall.texture);
    let textureX = Math.floor((tileSize / tileSize) * wall.textureX);

    // Check if player is jumping and adjust wall Y
    let jump = (player.get('jump') * 10) / wall.distance;
    let y = canvasHeight / 2 - size / 2 + player.get('look') + jump;

    // Draw
    canvasScreen.drawImage({
      image: texture.image,
      clipX: textureX,
      clipY: 0,
      clipWidth: 1,
      clipHeight: tileSize,
      x,
      y,
      width: 1,
      height: size,
    });

    // Shadow
    if (wall.shadow) {
      canvasScreen.drawRectangle({
        x,
        y,
        width: 1,
        height: size,
        color: 'rgba(0,0,0,0.4)',
      });
    }

    // "light"
    const alpha = 0.2; // @ TODO: make shadow opacity on every wall acoording to distance
    canvasScreen.drawRectangle({
      x,
      y,
      width: 1,
      height: size,
      color: `rgba(0,0,0,${alpha})`,
    });

    //this.renderGround(x, y + size);
  };

  const castWall = (angle: number) => {
    // Angle correction
    const PI2 = Math.PI * 2;
    angle %= PI2;

    if (angle < 0) {
      angle += PI2;
    }

    // Initial values
    const { tilesX, tilesY, map } = config.scenario;

    const playerX = player.get('x');
    const playerY = player.get('y');

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const px = playerX / tileSize; // Fix camera position
    const py = playerY / tileSize;

    // Ray Facing diretion
    const rayFacingRight = angle > PI2 * 0.75 || angle < PI2 * 0.25;
    const rayFacingUp = angle < 0 || angle > Math.PI;

    // Define mutable variables
    let shadow = false;

    let rayDirection = 'vertical';

    let dist = 0;
    let textureX: number;
    let texture: string;

    //#  Vertical Ray ------

    // Camera slope
    let slope = sin / cos;
    let nextVerticalX = rayFacingRight ? 1 : -1;
    let nextVerticalY = nextVerticalX * slope;

    let verX = rayFacingRight ? Math.ceil(px) : Math.floor(px);
    let verY = py + (verX - px) * slope;

    // Loop all map tiles
    while (verX >= 0 && verX < tilesX && verY >= 0 && verY < tilesY) {
      let wallX = Math.floor(verX + (rayFacingRight ? 0 : -1));
      let wallY = Math.floor(verY);

      // Hitted a floor?
      // @TODO change floor and make based on object "isWall"
      if (map[wallY][wallX] !== 'floor') {
        // Calculate distance from camera to ray
        dist = Math.sqrt(Math.pow(verX - px, 2) + Math.pow(verY - py, 2));

        // Define Texture props
        texture = map[wallY][wallX];
        textureX = (verY * tileSize) % tileSize;

        break;
      }

      // Didn't hit, try next ray (this is the key for algorithm speed)
      verX += nextVerticalX;
      verY += nextVerticalY;
    }

    //#  Horizontal Ray ------
    slope = cos / sin;

    let nextHorizontalY = rayFacingUp ? -1 : 1;
    let nextHorizontalX = nextHorizontalY * slope;

    let horY = rayFacingUp ? Math.floor(py) : Math.ceil(py);
    let horX = px + (horY - py) * slope;

    // Vertical Ray
    while (horX >= 0 && horX < tilesX && horY >= 0 && horY < tilesY) {
      let wallY = Math.floor(horY + (rayFacingUp ? -1 : 0));
      let wallX = Math.floor(horX);

      if (map[wallY][wallX] !== 'floor') {
        let distanceHorizontal = Math.sqrt(Math.pow(horX - px, 2) + Math.pow(horY - py, 2));

        // Only calc this if Vertical distance is higher than horizontal
        if (dist === 0 || distanceHorizontal < dist) {
          shadow = true;
          dist = distanceHorizontal;
          texture = map[wallY][wallX];
          textureX = (horX * tileSize) % tileSize;

          rayDirection = 'horizontal';
        }
        break;
      }
      horX += nextHorizontalX;
      horY += nextHorizontalY;
    }

    // Store ray distance
    props.zIndex.push(dist);

    // Fix distance to avoid fish eye effect
    dist *= Math.cos(player.get('pod') * (Math.PI / 180) - angle);

    // Set shadow according to ray direction
    shadow = rayDirection === 'horizontal';

    // Debug ray
    let toX = rayDirection === 'vertical' ? verX : horX;
    toX *= tileSize;
    let toY = rayDirection === 'vertical' ? verY : horY;
    toY *= tileSize;

    canvasMinimap.drawLine({
      x: playerX,
      y: playerY,
      toX: toX,
      toY: toY,
      color: '#BBFF00',
    });

    // Return Ray props
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

    // Set base resolution according to canvas width
    let resolution = Math.ceil(canvasWidth / props.resolution);

    // For each resolution, cast a wall
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

  // - - - - - - - - - - - - - - - - - - - - - - - -

  // Render everything
  const render = () => {
    renderWalls();
  };

  return {
    render,
  };
};

export default RayCasting;
