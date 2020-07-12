import { PlayerType } from '../../components/Player/types';
import { CanvasType } from '../../engine/Canvas/types';

import { calcAngle, convertAngleToRadians, calcDistanceBetweenPoints } from '../calculations';

import { scenario, game } from '../../config';

function Sprite(image: HTMLImageElement) {
  const props = {
    image,
    x: 0,
    y: 0,
    visible: false,
    distance: 0,
    angle: 0,
  };

  const get = (prop) => {
    return props[prop];
  };

  const calcDistance = (camera: PlayerType, x: number, y: number) => {
    // Distance
    props.distance = calcDistanceBetweenPoints(camera.get('x'), camera.get('y'), x, y);
  };

  const updateProps = (camera: PlayerType, x: number, y: number) => {
    props.x = x;
    props.y = y;

    const cameraFOV = camera.get('fieldOfView');
    const halfFOV = convertAngleToRadians(cameraFOV / 2);

    // Angle
    props.angle = calcAngle({
      cameraX: camera.get('x'),
      cameraY: camera.get('y'),
      cameraAngle: camera.get('angle'),
      targetX: props.x,
      targetY: props.y,
    });

    props.visible = props.angle < halfFOV * 1.5 ? true : false; // 1.5 margin error adjust

    calcDistance(camera, props.x, props.y);
  };

  const render = (
    camera: PlayerType,
    canvas: CanvasType,
    x: number,
    y: number,
    rayDistances: any
  ) => {
    updateProps(camera, x, y);

    if (!props.visible) return;

    const canvasWidth = canvas.getConfig().width;
    const canvasHeight = canvas.getConfig().height;
    const FOV = camera.get('fieldOfView');

    const spriteX = props.x - camera.get('x');
    const spriteY = props.y - camera.get('y');

    const spriteAngle = Math.atan2(spriteY, spriteX) - camera.get('angle'); // check this angle

    const distanceProjectionPlane = canvasWidth / 2 / Math.tan(FOV / 2);
    const spriteHeight = (canvasHeight / props.distance) * distanceProjectionPlane * 2;

    // Calculate where line starts and ends, centering on screen vertically
    const y0 = Math.floor(canvasHeight / 2) - Math.floor(spriteHeight / 2);
    const y1 = y0 + spriteHeight;

    const maxTextureHeight = scenario.tileSize;
    const maxTextureWidth = scenario.tileSize;

    const textureHeight = y0 - y1;
    const textureWidth = textureHeight; // Square sprites

    // Calculate Sprite coordinates

    const viewDist = canvas.getConfig().height; // OK

    const x0 = Math.tan(spriteAngle) * viewDist; // The glitch on sprite probably here
    const xFinal = canvasWidth / 2 + x0 - textureWidth / 2;

    // X Height proportion
    const columnHeight = textureHeight / maxTextureHeight;

    // Render column by column so we can check if it's behind a wall
    for (let i = 0; i < maxTextureWidth; i++) {
      for (let j = 0; j < columnHeight; j++) {
        const x1 = Math.floor(xFinal + (i - 1) * columnHeight + j); // The glitch on sprite probably here
        // Check distance before render column
        if (rayDistances[x1] > props.distance && props.distance < game.depthfOfField) {
          canvas.drawImage({
            image: props.image,
            clipX: i,
            clipY: 0,
            clipWidth: 1,
            clipHeight: maxTextureHeight - 1,
            x: x1, // x1
            y: y1,
            width: 1,
            height: textureHeight,
          });
        }
      }
    }
  };

  return { render, get, calcDistance };
}

export default Sprite;
