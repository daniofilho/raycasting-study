import { CanvasType } from '../../Canvas/types';
import { PlayerType } from '../../Player/types';
import { ScenarioType } from '../../../types';

import { calcDistanceType, castType, renderRayType } from './types';

import * as config from '../../../config';

// Math PI relative variables - pure matemagician here
const PI2 = Math.PI / 2;
const PI3 = (3 * Math.PI) / 2;
const DR = 0.0174533; // one degree in radians

const RayCasting = (
  scenario: ScenarioType,
  player: PlayerType,
  canvasMinimap: CanvasType,
  canvasScreen: CanvasType
) => {
  const { tiles, tilesX, tilesY, tileSize } = scenario;

  const props = {
    rays: player.get('fieldOfView'), // how many rays will cast

    dof: config.game.depthfOfField,
    fov: player.get('fieldOfView'), // field of view
  };

  const raysQuantity = tilesX * tileSize;

  // Ray
  let rayX: number, rayY: number;
  let rayXoffset: number, rayYoffset: number;

  // Position of ray on map
  let mapX: number, mapY: number, mapPosition: number;

  const normalizeAngle = (angle: number) => {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
      angle = 2 * Math.PI + angle;
    }
    return angle;
  };

  // # Determine the distance between player and "ray hit" point
  const calcDistance = ({ object, target }: calcDistanceType) => {
    return Math.sqrt(
      (target.x - object.x) * (target.x - object.x) + (target.y - object.y) * (target.y - object.y)
    );
  };

  // # Render Casted ray
  const renderRay = ({ rayX, rayY }: renderRayType) => {
    // ## Mini map 2D rendering
    // starting from where the player is to where it ends
    const playerX = player.get('x');
    const playerY = player.get('y');

    canvasMinimap.drawLine({
      x: playerX,
      y: playerY,
      toX: rayX,
      toY: rayY,
      color: '#00FFFF',
    });
  };

  // # Ray Casting on horizontal lines
  const castHorizontalRays = ({
    rayAngle,
    playerX,
    playerY,
    isRayFacingDown,
    isRayFacingUp,
    isRayFacingRight,
    isRayFacingLeft,
  }: castType) => {
    let currentDOF = 0;

    let horizontalDistance = 1000000; //we need to check the lowest value, so let's make it high
    let horizontalX = playerX;
    let horizontalY = playerY;

    // Find the y-coordinate of the closest horizontal grid intersenction
    const interceptionY = Math.floor(playerY / tileSize) * tileSize;
    rayY = interceptionY;
    rayY += isRayFacingDown ? tileSize : 0;

    const adjacent = (rayY - playerY) / Math.tan(rayAngle);
    rayX = playerX + adjacent;

    // Now we need X and Y offset
    rayYoffset = tileSize;
    if (isRayFacingUp) rayYoffset *= -1; // negative or positive according to angle direction

    rayXoffset = tileSize / Math.tan(rayAngle);
    rayXoffset *= isRayFacingLeft && rayXoffset > 0 ? -1 : 1;
    rayXoffset *= isRayFacingRight && rayXoffset < 0 ? -1 : 1;

    // ## ray os looking straight? left or right
    // in this situation it's impossible for ray hit a horizontal line
    if (rayAngle === 0 || rayAngle === Math.PI) {
      rayX = playerX;
      rayY = playerY;

      currentDOF = props.dof; // so end loop
    }

    // If facing up, need to add tile size so rayY will be right
    if (isRayFacingUp) rayY--;

    // ## We don't wanna check forever, so we add a depth of field limit
    while (currentDOF < props.dof) {
      // determine position of ray on map
      mapX = Math.floor(rayX / tileSize);
      mapY = Math.floor(rayY / tileSize);
      mapPosition = mapY * tilesX + mapX; // tilesX = how many tiles have on x-coordinate

      // Check if ray hits a wall or scenario bounds
      if (
        mapPosition > 0 && // inside screen
        mapPosition < tilesX * tilesY && // not out screen
        tiles[mapPosition] === 1 // hit wall
      ) {
        // Save values to check lowest later
        horizontalX = rayX;
        horizontalY = rayY;
        horizontalDistance = calcDistance({
          object: { x: playerX, y: playerY },
          target: { x: horizontalX, y: horizontalY },
        });

        currentDOF = props.dof; // end loop
      } else {
        // to check next line, just add the offset value
        // # this is the key optimization of this algorithm
        rayX += rayXoffset;
        rayY += rayYoffset;
        currentDOF++;
      }
    }

    return {
      horizontalX,
      horizontalY,
      horizontalDistance,
    };
  };

  // # Ray Casting on vertical lines
  const castVerticalRays = ({
    rayAngle,
    playerX,
    playerY,
    isRayFacingDown,
    isRayFacingUp,
    isRayFacingRight,
    isRayFacingLeft,
  }: castType) => {
    let currentDOF = 0;

    let verticalDistance = 1000000; //we need to check the lowest value, so let's make it high
    let verticalX = playerX;
    let verticalY = playerY;

    // Find the y-coordinate of the closest horizontal grid intersenction
    const interceptionX = Math.floor(playerX / tileSize) * tileSize;
    rayX = interceptionX;
    rayX += isRayFacingRight ? tileSize : 0;

    const adjacent = (rayX - playerX) * Math.tan(rayAngle);
    rayY = playerY + adjacent;

    // Now we need X and Y offset
    rayXoffset = tileSize;
    if (isRayFacingLeft) rayXoffset *= -1; // negative or positive according to angle direction

    rayYoffset = tileSize * Math.tan(rayAngle);
    rayYoffset *= isRayFacingUp && rayYoffset > 0 ? -1 : 1;
    rayYoffset *= isRayFacingDown && rayYoffset < 0 ? -1 : 1;

    // ## ray os looking straight? left or right
    // in this situation it's impossible for ray hit a horizontal line
    if (rayAngle === 0 || rayAngle === Math.PI) {
      rayX = playerX;
      rayY = playerY;

      currentDOF = props.dof; // so end loop
    }

    // If facing left, need to add tile size so rayX will be right
    if (isRayFacingLeft) rayX--;

    while (currentDOF < props.dof) {
      // determine position of ray on map
      mapX = Math.floor(rayX / tileSize);
      mapY = Math.floor(rayY / tileSize);
      mapPosition = mapY * tilesX + mapX; // tilesX = how many tiles have on x-coordinate

      // Check if ray hits a wall or scenario bounds
      if (
        mapPosition > 0 && // inside screen
        mapPosition < tilesX * tilesY && // not out screen
        tiles[mapPosition] === 1 // hit wall
      ) {
        // Save values to check lowest later
        verticalX = rayX;
        verticalY = rayY;
        verticalDistance = calcDistance({
          object: { x: playerX, y: playerY },
          target: { x: verticalX, y: verticalY },
        });

        currentDOF = props.dof; // end loop
      } else {
        // to check next line, just add the offset value
        // # this is the key optimization of this algorithm
        rayX += rayXoffset;
        rayY += rayYoffset;
        currentDOF++;
      }
    }

    return {
      verticalX,
      verticalY,
      verticalDistance,
    };
  };

  const render = () => {
    // Determine the ray angle of casting acording to player field of view
    let rayAngle = player.get('angle') - DR * (props.fov / 2);
    if (rayAngle < 0) {
      rayAngle += 2 * Math.PI;
    }
    if (rayAngle > 2 * Math.PI) {
      rayAngle -= 2 * Math.PI;
    }
    rayAngle = normalizeAngle(rayAngle);

    const playerY = Math.floor(player.get('y'));
    const playerX = Math.floor(player.get('x'));

    const isRayFacingDown = rayAngle < Math.PI;
    const isRayFacingUp = !isRayFacingDown;

    const isRayFacingRight = rayAngle < PI2 || rayAngle > PI3;
    const isRayFacingLeft = !isRayFacingRight;

    // cast the rays  - substitute of FOR for performance reasons
    for (let i = 0; i < props.fov; i++) {
      const HorRays = castHorizontalRays({
        rayAngle,
        playerX,
        playerY,
        isRayFacingDown,
        isRayFacingUp,
        isRayFacingRight,
        isRayFacingLeft,
      });
      const VertRays = castVerticalRays({
        rayAngle,
        playerX,
        playerY,
        isRayFacingDown,
        isRayFacingUp,
        isRayFacingRight,
        isRayFacingLeft,
      });

      // Which function gave the lowest value (lowest distance)?
      let rayX: number, rayY: number;
      if (VertRays.verticalDistance < HorRays.horizontalDistance) {
        rayX = VertRays.verticalX;
        rayY = VertRays.verticalY;
      }
      if (HorRays.horizontalDistance < VertRays.verticalDistance) {
        rayX = HorRays.horizontalX;
        rayY = HorRays.horizontalY;
      }

      //const distance

      // # Now render the slowest value
      // 2D ray
      renderRay({ rayX, rayY });

      // 3D wall - This is where we wanted to go
      //render3DRay()

      canvasScreen.drawText({
        x: 0,
        y: i * 25 + 25,
        text: `rayAngle: ${rayAngle}`,
      });

      // Increase angle for next ray
      rayAngle += DR;
      if (rayAngle < 0) {
        rayAngle += 2 * Math.PI;
      }
      if (rayAngle > 2 * Math.PI) {
        rayAngle -= 2 * Math.PI;
      }
    }
  };

  return {
    render,
  };
};

export default RayCasting;
