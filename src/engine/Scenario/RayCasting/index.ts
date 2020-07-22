import { MiniMapType } from '../../MiniMap/types';
import { ScreenType } from '../../Screen/types';
import { PlayerType } from '../../Player/types';
import { ScenarioPropType } from '../../Scenario/types';
import { TexturesType } from '../../Textures/types';

import { wallType, objectType, objectToDrawType } from './types';

import * as config from '../../../config/config';
import { drawImageType } from 'engine/Canvas/types';

const RayCasting = (
  scenario: ScenarioPropType,
  player: PlayerType,
  canvasMinimap: MiniMapType,
  canvasMiniMapDebug: MiniMapType,
  canvasScreen: ScreenType,
  textures: TexturesType
) => {
  const {
    map,
    tilesX,
    tilesY,
    tileSize,
    screen: { sky },
  } = scenario;

  const props = {
    fov: player.get('fov'), // field of view
    zIndex: [],
    podDistance: 0,
  };

  const canvasWidth = canvasScreen.getConfig('width');
  const canvasHeight = canvasScreen.getConfig('height');

  let objects: Partial<Array<objectType>> = [];

  // # Enviroment - - - - - - - - - - - - - - - - - - - - - - - -
  const drawFloor = (x: number, y: number) => {
    const gradient = canvasScreen.createLineGradient('#222', '#555');
    canvasScreen.drawRectangle({
      x,
      y,
      width: 1,
      height: canvasHeight - y,
      color: gradient,
    });
  };

  const renderSky = () => {
    if (!window.global.renderTextures) return;

    const jump = player.get('jump');
    const pod = player.get('pod');
    const look = player.get('look');

    // Draw two images side by side.
    // When one reaches the end of screen, reset position
    // This will make the effect of an infinite skybox
    canvasScreen.drawImage({
      image: sky.image,
      clipX: (sky.width / (6 * 60)) * pod,
      clipY: 0,
      clipWidth: sky.width,
      clipHeight: sky.height * 3,
      x: 0,
      y: -sky.height + look,
      width: canvasWidth,
      height: (canvasHeight + jump / 10) * 3,
    });

    canvasScreen.drawImage({
      image: sky.image,
      clipX: (sky.width / (6 * 60)) * (pod - 360),
      clipY: 0,
      clipWidth: sky.width,
      clipHeight: sky.height * 3,
      x: 0,
      y: -sky.height + look,
      width: canvasWidth,
      height: (canvasHeight + jump / 10) * 3,
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // # Objects - - - - - - - - - - - - - - - - - - - - - - - - -

  const getAllObjectsCoordinates = () => {
    new Array(tilesY).fill('').forEach((_, y) => {
      new Array(tilesX).fill('').forEach((_, x) => {
        const x0 = x * tileSize;
        const y0 = y * tileSize;

        const objectTexture = textures.get(map[y][x]);

        if (objectTexture.isObject)
          objects.push({
            texture: objectTexture,
            x: x0,
            y: y0,
          });
      });
    });
  };

  const drawObject = (object: objectToDrawType, left: number) => {
    if (!object) return;
    if (!window.global.renderTextures) return;

    const {
      size,
      distance,
      props: { texture },
    } = object;
    const textureWidth = tileSize;
    const textureHeight = tileSize;

    // "shadow"
    const { maxDistanceVisible } = config.game.render;
    let alpha = (maxDistanceVisible * 0.2) / distance;
    if (alpha > 1) alpha = 1; // avoid max brightness

    // Loop each pixel of texture to draw
    new Array(textureWidth).fill('').forEach((_, i) => {
      const pixel = size / textureWidth;
      const x = pixel * i + left;
      const jump = (player.get('jump') * 10) / distance;
      const y = (canvasHeight - size) / 2 + player.get('look') + jump;

      // Don't render sprites behind walls
      if (props.zIndex[Math.round(x)] < distance) return;

      const drawProps: drawImageType = {
        image: texture.image,
        clipX: i,
        clipY: 0,
        clipWidth: 1,
        clipHeight: textureHeight,
        x,
        y,
        width: pixel,
        height: size,
      };

      // Apply filter if it's not a light
      if (!texture.isLight) {
        drawProps.filter = `brightness(${alpha})`;
      }

      canvasScreen.drawImage(drawProps);
    });
  };

  const renderObjects = () => {
    const objectsToDraw = [];
    const pod = player.get('pod');
    const fov = player.get('fov');

    const playerX = player.get('x');
    const playerY = player.get('y');

    // Loop all objetcs on scenario
    objects.map((object) => {
      const dx = (object.x + tileSize / 2 - playerX) / tileSize;
      const dy = (object.y + tileSize / 2 - playerY) / tileSize;

      let angle = Math.atan2(dy, dx) - pod * (Math.PI / 180);

      if (angle < -Math.PI) {
        angle += 2 * Math.PI;
      }
      if (angle >= Math.PI) {
        angle -= 2 * Math.PI;
      }

      // Check if object is inside angle of view
      if (angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const viewDist = canvasWidth / Math.tan(fov / 2);
        const size = config.game.render.wallHeight / (Math.cos(angle) * distance);

        // Add it to draw array
        objectsToDraw.push({
          distance: distance,
          angle: angle,
          viewDist: viewDist,
          size: size,
          props: object,
        });
      }
    });

    // Sort objects and render from farther to closer
    objectsToDraw.sort(function (a, b) {
      if (a.distance < b.distance) return 1;
      if (a.distance > b.distance) return -1;
      return 0;
    });

    // Now loop the objects and draw
    objectsToDraw.map((object) => {
      const x = Math.tan(object.angle) * object.viewDist;
      const left = canvasWidth / 2 + x - object.size / 2;
      drawObject(object, left);
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // # Wall - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const drawWall = (x: number, wall: wallType, debugSingleRay: boolean) => {
    // Wall props
    let size = config.game.render.wallHeight / wall.distance;
    let texture = textures.get(wall.texture);
    let textureX = Math.floor((tileSize / tileSize) * wall.textureX);

    // Check if player is jumping and adjust wall Y
    let jump = (player.get('jump') * 10) / wall.distance;
    let y = canvasHeight / 2 - size / 2 + player.get('look') + jump;

    // Draw
    if (window.global.renderTextures) {
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
    } else {
      canvasScreen.drawRectangle({
        color: '#00F',
        x,
        y,
        width: 1,
        height: size,
      });
    }

    // Shadow
    if (wall.shadow) {
      canvasScreen.drawRectangle({
        x,
        y,
        width: 1,
        height: size,
        color: 'rgba(0,0,0,0.2)',
      });
    }

    // "light"
    const { maxDistanceVisible } = config.game.render;
    const alpha = wall.distance / maxDistanceVisible;
    canvasScreen.drawRectangle({
      x,
      y,
      width: 1,
      height: size,
      color: `rgba(0,0,0,${alpha})`,
    });

    // debug de ray fo center
    if (debugSingleRay) {
      canvasMiniMapDebug.drawLine({
        x: player.get('x'),
        y: player.get('y'),
        toX: wall.rayX,
        toY: wall.rayY,
        color: '#F00',
      });
    }

    drawFloor(x, y + size);
  };

  const castWallRay = (angle: number) => {
    // Angle correction
    const PI2 = Math.PI * 2;
    angle %= PI2;

    if (angle < 0) {
      angle += PI2;
    }

    // Initial values
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

      const object = textures.get(map[wallY][wallX]);

      // Hitted a floor?
      if (object && object.isWall) {
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

      const object = textures.get(map[wallY][wallX]);

      if (object && object.isWall) {
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
      rayX: toX,
      rayY: toY,
    };
  };

  const renderWalls = () => {
    props.zIndex = [];

    const pod = player.get('pod');

    // Set base resolution according to canvas width
    let rayQuantity = Math.ceil(canvasWidth);

    // For each resolution, cast a wall
    for (let x = 0; x < rayQuantity; x++) {
      let debugSingleRay = false;

      let viewDist = canvasWidth / Math.tan(props.fov / 2);
      let rayx = -rayQuantity / 2 + x;
      let rayDist = Math.sqrt(rayx * rayx + viewDist * viewDist);
      let rayAngle = Math.asin(rayx / rayDist);

      let wall = castWallRay(pod * (Math.PI / 180) + rayAngle);
      if (x === rayQuantity / 2) {
        debugSingleRay = true;
        props.podDistance = wall.distance;
      }
      drawWall(x, wall, debugSingleRay);
    }
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Setup
  const setup = () => {
    getAllObjectsCoordinates();
  };

  // Render everything
  const render = () => {
    renderSky();
    renderWalls();
    renderObjects();
  };

  return {
    setup,
    render,
  };
};

export default RayCasting;
