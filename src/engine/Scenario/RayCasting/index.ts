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
  renderObjectsType,
  renderObject,
} from './types';

import * as config from '../../../config';

import { normalizeAngle, calcDistance } from '../../calculations';

// Math PI relative variables - pure matemagician here
const PI2 = Math.PI / 2;
const PI3 = (3 * Math.PI) / 2;

const RayCasting = (
  scenario: ScenarioPropType,
  player: PlayerType,
  canvasMinimap: MiniMapType,
  canvasMiniMapDebug: MiniMapType,
  canvasScreen: ScreenType,
  textures: TexturesType
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

  // # Draw a debug Ray
  const debugSingleRay = ({ toX, toY, color }: debugSingleRayType) => {
    const playerX = player.get('x');
    const playerY = player.get('y');

    canvasMiniMapDebug.drawLine({
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

    canvasMinimap.drawLine({
      x: playerX,
      y: playerY,
      toX: rayX,
      toY: rayY,
      color: '#00FFFF',
    });
  };

  // # Render Sky
  const renderSky = (wallX: number, wallY: number, wallWidth: number) => {
    if (window.global.renderTextures) {
      const pattern = canvasScreen.createPattern(scenario.screen.sky.image);

      return canvasScreen.drawRectangle({
        x: wallX,
        y: 0,
        width: wallWidth,
        height: wallY,
        color: pattern,
      });
    }

    const { r: skyR, g: skyG, b: skyB } = scenario.screen.sky.color;
    const skyColor = `rgb(${skyR}, ${skyG}, ${skyB})`;

    return canvasScreen.drawRectangle({
      x: wallX,
      y: 0,
      width: wallWidth,
      height: wallY,
      color: skyColor,
    });
  };

  const renderObject = ({
    pixelOfTexture,
    objectId,
    wallHeight,
    wallWidth,
    wallY,
    wallX,
    horizontalRay,
    alpha,
  }: renderObject) => {
    if (window.global.renderTextures) {
      const objectTexture: TextureType = textures.get(objectId);

      if (!objectTexture) return;

      const clip = horizontalRay ? objectTexture.horizontal : objectTexture.vertical;

      return canvasScreen.drawImage({
        image: objectTexture.image,
        x: wallX,
        y: wallY,
        width: tileSize,
        height: wallHeight,
        clipX: clip.clipX + Math.floor(pixelOfTexture),
        clipY: clip.clipY,
        clipWidth: tileSize,
        clipHeight: tileSize,
      });
    }

    // # Wall texture
    const wallColor = `rgba(100,255,100,${alpha})`;

    return canvasScreen.drawRectangle({
      x: wallX,
      y: wallY,
      width: wallWidth,
      height: wallHeight,
      color: wallColor,
    });
  };

  // # Render Floor
  const renderFloor = (wallX: number, wallY: number, wallWidth: number, wallHeight: number) => {
    //const { r: floorR, g: floorG, b: floorB } = scenario.screen.floor.color;
    //const floorColor = `rgb(${floorR}, ${floorG}, ${floorB})`;

    const gradient = canvasScreen.createLineGradient(
      scenario.screen.floor.color.from,
      scenario.screen.floor.color.to
    );

    const floorY = wallY + wallHeight;
    canvasScreen.drawRectangle({
      x: wallX,
      y: floorY,
      width: wallWidth,
      height: canvasScreen.getConfig().height - floorY,
      color: gradient,
    });
  };

  // # main Render 3D function
  const render3D = ({
    rayAngle,
    distance,
    index,
    objectId,
    pixelOfTexture,
    horizontalRay,
  }: render3DType) => {
    // # Definitions

    const correctWallDistance = distance * Math.cos(rayAngle - player.get('angle'));
    const distanceProjectionPlane = canvasScreen.getConfig().width / 2 / Math.tan(fovAngle / 2);

    // Define the line height to draw
    const wallHeight = Math.round((tileSize / correctWallDistance) * distanceProjectionPlane);
    const wallWidth = Math.ceil(canvasScreen.getConfig().width / raysQuantity);

    // Find positions
    const wallX = index * wallWidth;
    const wallY = canvasScreen.getConfig().height / 2 - wallHeight / 2;

    // Set alpha color to simulate lighting
    const alpha = config.game.render.light / correctWallDistance;

    // # Render

    // Draw Sky
    renderSky(wallX, wallY, wallWidth);

    // Draw wall
    renderObject({
      objectId,
      pixelOfTexture,
      horizontalRay,
      wallWidth,
      wallHeight,
      wallX,
      wallY,
      alpha,
    });

    // Draw Floor
    renderFloor(wallX, wallY, wallWidth, wallHeight);
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
        tiles[mapPosition] !== 0 // hit wall
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
      objectId: tiles[mapPosition],
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
        tiles[mapPosition] !== 0 // hit wall
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
      objectId: tiles[mapPosition],
    };
  };

  // # Cast all Rays
  const castRays = ({ rayAngle }: castType) => {
    const HorRays = castHorizontalRays({ rayAngle });
    const VertRays = castVerticalRays({ rayAngle });
    let distance: number;

    // Which function gave the lowest value (lowest distance)?
    let rayX: number,
      rayY: number,
      objectId: number,
      pixelOfTexture: number,
      horizontalRay: boolean;
    if (VertRays.verticalDistance < HorRays.horizontalDistance) {
      // # Rays props
      rayX = VertRays.verticalX;
      rayY = VertRays.verticalY;

      // # Object props
      distance = VertRays.verticalDistance;
      objectId = VertRays.objectId;

      // Define the correct pixel to render of texture
      let aux = Math.floor(rayY / tileSize);
      aux = aux * tileSize;
      pixelOfTexture = rayY - aux;

      // came from which ray
      horizontalRay = true;
    }
    if (HorRays.horizontalDistance < VertRays.verticalDistance) {
      // # Ray props
      rayX = HorRays.horizontalX;
      rayY = HorRays.horizontalY;

      // # Object props
      distance = HorRays.horizontalDistance;
      objectId = HorRays.objectId;

      // Define the correct pixel to render of texture
      let aux = Math.floor(rayX / tileSize);
      aux = aux * tileSize;
      pixelOfTexture = rayX - aux;

      // Facing direction
      horizontalRay = false;
    }

    return {
      rayX,
      rayY,
      distance,
      objectId,
      pixelOfTexture,
      horizontalRay,
    };
  };

  // # Debug the Ray on front of player
  const castDebugRay = () => {
    const { rayX, rayY } = castRays({ rayAngle: player.get('angle') });
    debugSingleRay({ toX: rayX, toY: rayY, color: '#BBFF00' });
  };

  // # Render all objects
  const renderObjects = (renderObjects: Array<renderObjectsType>) => {
    renderObjects.map(
      ({ rayX, rayY, rayAngle, distance, rayNumber, pixelOfTexture, objectId, horizontalRay }) => {
        // 2D ray
        renderRay({ rayX, rayY });

        // 3D wall - This is where we wanted to go
        render3D({ index: rayNumber, objectId, distance, horizontalRay, pixelOfTexture, rayAngle });
      }
    );
  };

  // Render everything
  const render = () => {
    const objects = [];

    // Determine the ray angle of casting acording to player field of view
    let rayAngle = player.get('angle') - fovAngle / 2;

    // Cast debug Ray
    castDebugRay();

    // Cast the rays
    new Array(raysQuantity).fill('').forEach((_, ray) => {
      // Cast rays
      const { rayX, rayY, distance, objectId, pixelOfTexture, horizontalRay } = castRays({
        rayAngle,
      });

      objects.push({
        rayX,
        rayY,
        rayAngle,
        distance,
        objectId,
        pixelOfTexture,
        horizontalRay,
        rayNumber: ray,
      });

      // Increase angle for next ray
      rayAngle += fovAngle / raysQuantity;
    });

    // Finaly render everything found
    return renderObjects(objects);
  };

  return {
    render,
  };
};

export default RayCasting;
