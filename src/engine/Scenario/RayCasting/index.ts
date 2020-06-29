import { MiniMapType } from '../../MiniMap/types';
import { ScreenType } from '../../Screen/types';
import { PlayerType } from '../../Player/types';
import { ScenarioType } from '../../../types';

import {
  calcDistanceType,
  castType,
  renderRayType,
  debugSingleRayType,
  render3DType,
} from './types';

import * as config from '../../../config';

// Math PI relative variables - pure matemagician here
const PI2 = Math.PI / 2;
const PI3 = (3 * Math.PI) / 2;

const RayCasting = (
  scenario: ScenarioType,
  player: PlayerType,
  canvasMinimap: MiniMapType,
  canvasMiniMapDebug: MiniMapType,
  canvasScreen: ScreenType
) => {
  const { tiles, tilesX, tilesY, tileSize } = scenario;

  const props = {
    rays: player.get('fieldOfView'), // how many rays will cast

    dof: config.game.depthfOfField,
    fov: player.get('fieldOfView'), // field of view
  };

  const raysQuantity = tilesX * tileSize;
  const fovAngle = props.fov * (Math.PI / 180);

  // Ray
  let rayX: number, rayY: number;
  let rayXoffset: number, rayYoffset: number;

  // Position of ray on map
  let mapX: number, mapY: number, mapPosition: number;

  const normalizeAngle = (angle: number) => {
    //return angle;
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

  // # Draw a debug Ray
  const debugSingleRay = ({ toX, toY, color }: debugSingleRayType) => {
    const playerX = player.get('x');
    const playerY = player.get('y');

    canvasMiniMapDebug.canvas.drawLine({
      x: playerX,
      y: playerY,
      toX: toX,
      toY: toY,
      color,
    });
  };

  // # Render Casted ray
  const renderRay = ({ rayX, rayY }: renderRayType) => {
    // ## Mini map 2D rendering
    // starting from where the player is to where it ends
    const playerX = player.get('x');
    const playerY = player.get('y');

    canvasMinimap.canvas.drawLine({
      x: playerX,
      y: playerY,
      toX: rayX,
      toY: rayY,
      color: '#00FFFF',
    });
  };

  // # Render the fake 3D
  const render3D = ({ rayAngle, distance, index }: render3DType) => {
    const wallWidth = config.game.render.wall.width;

    const correctWallDistance = distance * Math.cos(rayAngle - player.get('angle'));

    var distanceProjectionPlane =
      canvasScreen.canvas.getConfig().width / 2 / Math.tan(fovAngle / 2);

    // Define the line height to draw
    const lineHeight = (tileSize / correctWallDistance) * distanceProjectionPlane;

    // Find positions
    const x = index * wallWidth;
    const y = canvasScreen.canvas.getConfig().height / 2 - lineHeight / 2;

    // Define sizes
    const width = wallWidth;
    const height = lineHeight;

    // Set alpha color to simulate lighting
    const alpha = config.game.render.light / correctWallDistance;

    // Draw the line
    canvasScreen.canvas.drawRectangle({ x, y, width, height, color: `rgba(255,100,100,${alpha})` });
  };

  // # Ray Casting on horizontal lines
  const castHorizontalRays = ({ rayAngle }: castType) => {
    rayAngle = normalizeAngle(rayAngle);

    const playerY = Math.floor(player.get('y'));
    const playerX = Math.floor(player.get('x'));

    const isRayFacingDown = rayAngle < Math.PI;
    const isRayFacingUp = !isRayFacingDown;

    const isRayFacingRight = rayAngle < PI2 || rayAngle > PI3;
    const isRayFacingLeft = !isRayFacingRight;

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
  const castVerticalRays = ({ rayAngle }: castType) => {
    rayAngle = normalizeAngle(rayAngle);

    const playerY = Math.floor(player.get('y'));
    const playerX = Math.floor(player.get('x'));

    const isRayFacingDown = rayAngle < Math.PI;
    const isRayFacingUp = !isRayFacingDown;

    const isRayFacingRight = rayAngle < PI2 || rayAngle > PI3;
    const isRayFacingLeft = !isRayFacingRight;

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

  // # Cast all Rays
  const castRays = ({ rayAngle }: castType) => {
    const HorRays = castHorizontalRays({ rayAngle });
    const VertRays = castVerticalRays({ rayAngle });
    let distance: number;

    // Which function gave the lowest value (lowest distance)?
    let rayX: number, rayY: number;
    if (VertRays.verticalDistance < HorRays.horizontalDistance) {
      rayX = VertRays.verticalX;
      rayY = VertRays.verticalY;
      distance = VertRays.verticalDistance;
    }
    if (HorRays.horizontalDistance < VertRays.verticalDistance) {
      rayX = HorRays.horizontalX;
      rayY = HorRays.horizontalY;
      distance = HorRays.horizontalDistance;
    }

    return {
      rayX,
      rayY,
      distance,
    };
  };

  // # Debug the Ray on front of player
  const castDebugRay = () => {
    const { rayX, rayY } = castRays({ rayAngle: player.get('angle') });
    debugSingleRay({ toX: rayX, toY: rayY, color: '#BBFF00' });
  };

  // Render everything
  const render = () => {
    // Determine the ray angle of casting acording to player field of view
    let rayAngle = player.get('angle') - fovAngle / 2;

    // Cast debug Ray
    castDebugRay();

    // Cast the rays
    for (let i = 0; i < raysQuantity; i++) {
      // Cast rays
      const { rayX, rayY, distance } = castRays({ rayAngle });

      // 2D ray
      renderRay({ rayX, rayY });

      // 3D wall - This is where we wanted to go
      render3D({ index: i, distance, rayAngle });

      // Increase angle for next ray
      rayAngle += fovAngle / raysQuantity;
    }
  };

  return {
    render,
  };
};

export default RayCasting;
