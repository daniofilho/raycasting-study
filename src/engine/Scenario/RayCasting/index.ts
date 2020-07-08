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

import { normalizeAngle, calcDistance, numIsMultipleOf } from '../../calculations';

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
    dof: config.game.depthfOfField,
    fov: player.get('fieldOfView'), // field of view
  };

  let raysQuantity = tilesX * tileSize;
  // Don't cast more rays than canvas size, will be a waste of resources
  if (raysQuantity > config.screen.width) raysQuantity = config.screen.width;

  const fovAngle = props.fov * (Math.PI / 180);

  let minWallHeight = 0;

  // Ray
  let rayX: number, rayY: number;
  let rayXoffset: number, rayYoffset: number;

  // Position of ray on map
  let mapX: number, mapY: number, mapPosition: number;

  // ###################  Misc  ###################

  // Calculate the wall Height
  const calculateWallHeight = (distance: number, rayAngle: number) => {
    const correctWallDistance = distance * Math.cos(rayAngle - player.get('angle'));
    const distanceProjectionPlane = canvasScreen.getConfig().width / 2 / Math.tan(fovAngle / 2);
    return Math.round((tileSize / correctWallDistance) * distanceProjectionPlane);
  };

  // Get the minimum Height of all walls
  const getMinimumWallHeightFromWalls = (renderList: Array<renderListType>) => {
    let minHeightFound = 100000;

    renderList.map(({ distance, rayAngle }) => {
      const wallHeight = calculateWallHeight(distance, rayAngle);
      if (wallHeight && wallHeight < minHeightFound) {
        minHeightFound = wallHeight;
      }
    });

    return minHeightFound;
  };

  // ###################  Casts  ###################

  // # Ray Casting on horizontal lines
  const castHorizontalRays = ({ rayAngle }: castType) => {
    rayAngle = normalizeAngle(rayAngle);

    const playerY = Math.floor(player.get('y'));
    const playerX = Math.floor(player.get('x'));

    const isRayFacingDown = rayAngle < Math.PI;
    const isRayFacingUp = !isRayFacingDown;

    const isRayFacingLeft = rayAngle > Math.PI / 2 && rayAngle < (3 * Math.PI) / 2;
    const isRayFacingRight = !isRayFacingLeft;

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

    // Check distance between camera and ray
    let distance = calcDistance({
      object: { x: playerX, y: playerY },
      target: { x: rayX, y: rayY },
    });

    // ## We don't wanna check forever, so we add a depth of field limit
    while (distance < props.dof) {
      // determine position of ray on map
      mapX = Math.floor(rayX / tileSize);
      mapY = Math.floor(rayY / tileSize);
      mapPosition = mapY * tilesX + mapX; // tilesX = how many tiles have on x-coordinate

      const objectTexture: TextureType = textures.get(tiles[mapPosition]);
      if (!objectTexture) {
        rayX += rayXoffset;
        rayY += rayYoffset;

        // Recheck distance
        distance = calcDistance({
          object: { x: playerX, y: playerY },
          target: { x: rayX, y: rayY },
        });
      } else {
        // Check if ray hits a wall or scenario bounds
        if (
          mapPosition > 0 && // inside screen
          mapPosition < tilesX * tilesY && // not out screen
          objectTexture.isWall &&
          rayX > 0 &&
          rayX < tilesX * tileSize &&
          rayY > 0 &&
          rayY < tilesY * tileSize
        ) {
          // Save values to check lowest later
          horizontalX = rayX;
          horizontalY = rayY;
          horizontalDistance = calcDistance({
            object: { x: playerX, y: playerY },
            target: { x: horizontalX, y: horizontalY },
          });

          distance = props.dof; // end loop
        } else {
          // to check next line, just add the offset value
          // # this is the key optimization of this algorithm
          rayX += rayXoffset;
          rayY += rayYoffset;

          // Recheck distance
          distance = calcDistance({
            object: { x: playerX, y: playerY },
            target: { x: rayX, y: rayY },
          });
        }
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

    const isRayFacingLeft = rayAngle > Math.PI / 2 && rayAngle < (3 * Math.PI) / 2;
    const isRayFacingRight = !isRayFacingLeft;

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

    // Check distance between camera and ray
    let distance = calcDistance({
      object: { x: playerX, y: playerY },
      target: { x: rayX, y: rayY },
    });

    while (distance < props.dof) {
      // determine position of ray on map
      mapX = Math.floor(rayX / tileSize);
      mapY = Math.floor(rayY / tileSize);
      mapPosition = mapY * tilesX + mapX; // tilesX = how many tiles have on x-coordinate

      const objectTexture: TextureType = textures.get(tiles[mapPosition]);
      if (!objectTexture) {
        rayX += rayXoffset;
        rayY += rayYoffset;

        // Recheck distance
        distance = calcDistance({
          object: { x: playerX, y: playerY },
          target: { x: rayX, y: rayY },
        });
      } else {
        // Check if ray hits a wall or scenario bounds
        if (
          mapPosition > 0 && // inside screen
          mapPosition < tilesX * tilesY && // not out screen
          objectTexture.isWall &&
          rayX > 0 &&
          rayX < tilesX * tileSize &&
          rayY > 0 &&
          rayY < tilesY * tileSize
        ) {
          // Save values to check lowest later
          verticalX = rayX;
          verticalY = rayY;
          verticalDistance = calcDistance({
            object: { x: playerX, y: playerY },
            target: { x: verticalX, y: verticalY },
          });

          distance = props.dof; // end loop
        } else {
          // to check next line, just add the offset value
          // # this is the key optimization of this algorithm
          rayX += rayXoffset;
          rayY += rayYoffset;

          // Recheck distance
          distance = calcDistance({
            object: { x: playerX, y: playerY },
            target: { x: rayX, y: rayY },
          });
        }
      }

      //canvasScreen.drawText({ x: 50, y: 50, color: '#FFF', text: `${distance}` });
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
      mapX,
      mapY,
    };
  };

  // # Debug the Ray on front of player
  const castDebugRay = () => {
    const { rayX, rayY } = castRays({ rayAngle: player.get('angle') });
    debugSingleRay({ toX: rayX, toY: rayY, color: '#BBFF00' });
  };

  // ################### Renders ###################

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

  // # Render the walls found on cast
  const renderWall = ({
    pixelOfTexture,
    objectId,
    wallHeight,
    wallWidth,
    wallY0,
    wallY1,
    wallX,
    horizontalRay,
    alpha,
    fog,
  }: renderWallType) => {
    // If it's a fog
    if (fog) {
      const patterns = canvasScreen.createPattern(config.game.render.fogImage);
      return canvasScreen.drawRectangle({
        x: wallX,
        y: wallY0,
        width: wallWidth,
        height: wallHeight,
        color: patterns,
      });
    }

    const objectTexture: TextureType = textures.get(objectId);

    if (!objectTexture) return;

    if (!objectTexture.isWall) return; // only render walls here

    if (window.global.renderTextures) {
      const clip = horizontalRay ? objectTexture.horizontal : objectTexture.vertical;

      let pixelToDraw = Math.floor(pixelOfTexture);
      pixelToDraw += clip.clipX;

      return canvasScreen.drawImage({
        image: objectTexture.image,
        x: wallX,
        y: wallY1,
        width: wallWidth,
        height: wallY0 - wallY1,
        clipX: pixelToDraw,
        clipY: clip.clipY,
        clipWidth: 1,
        clipHeight: tileSize,
      });
    }

    // # Wall texture
    const wallColor = `rgba(100,255,100,${alpha})`;

    return canvasScreen.drawRectangle({
      x: wallX,
      y: wallY0,
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

  // # Render Sprites
  const renderObjects = (rayDistances: any) => {
    const objects = [];

    // First wee need to loop all the objects and get their position and distance relative to player
    new Array(tilesX).fill('').forEach((_, x) => {
      new Array(tilesY).fill('').forEach((_, y) => {
        const x0 = x * tileSize + tileSize / 2; // center asset tile square
        const y0 = y * tileSize + tileSize / 2;

        const mapPosition = y * tilesX + x;

        const objectId = tiles[mapPosition];
        const objectTexture: TextureType = textures.get(objectId);

        if (!objectTexture || !objectTexture.isObject) return; // only render objects here

        objectTexture.sprite.calcDistance(player, x0, y0);

        objects.push({
          sprite: objectTexture.sprite,
          distance: objectTexture.sprite.get('distance'),
          x0,
          y0,
        });
      });
    });

    // Now we sort the objects to first render from furthest and then the closest
    objects.sort(function (a, b) {
      return b.distance - a.distance;
    });
    objects.map((obj) => {
      obj.sprite.render(player, canvasScreen, obj.x0, obj.y0, rayDistances);
    });
  };

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
    let fog = false;

    const correctWallDistance = distance * Math.cos(rayAngle - player.get('angle'));

    // Define the line height to draw
    let wallHeight = calculateWallHeight(distance, rayAngle);
    const wallWidth = Math.ceil(canvasScreen.getConfig().width / raysQuantity);

    // WallHeight will be NaN if it's out of field view
    if (!wallHeight) {
      // Make a minimum wall height and cast a fog
      wallHeight = minWallHeight;
      fog = true;
    }

    // Find positions
    const wallX = index; // * wallWidth;
    const wallY0 = Math.floor(canvasScreen.getConfig().height / 2) - Math.floor(wallHeight / 2);
    //const wallY0 = canvasScreen.getConfig().height / 2 - wallHeight / 2;
    const wallY1 = wallY0 + wallHeight;

    // Set alpha color to simulate lighting
    const alpha = config.game.render.light / correctWallDistance;

    // # Render

    // Draw Sky
    renderSky(wallX, wallY0, wallWidth);

    // Draw wall
    renderWall({
      objectId,
      pixelOfTexture,
      horizontalRay,
      wallWidth,
      wallHeight,
      wallX,
      wallY0,
      wallY1,
      alpha,
      fog,
    });

    // Draw Floor
    //renderFloor(wallX, wallY0, wallWidth, wallHeight);
  };

  // ###################   Main  ###################

  // # Render all objects
  const renderEverything = (renderList: Array<renderListType>, rayDistances: any) => {
    // store the lowest wallHeight
    minWallHeight = getMinimumWallHeightFromWalls(renderList);

    // Render whatever ray cast hitted
    renderList.map(
      ({ rayX, rayY, rayAngle, distance, rayNumber, pixelOfTexture, objectId, horizontalRay }) => {
        // 2D ray
        renderRay({ rayX, rayY });

        // 3D wall - This is where we wanted to go
        render3D({ index: rayNumber, objectId, distance, horizontalRay, pixelOfTexture, rayAngle });
      }
    );
    // Render other stuff outside Ray Casting
    renderObjects(rayDistances);
  };

  // Render everything
  const render = () => {
    const list = [];
    const rayDistances = {}; // store distance of each Ray casted

    // Determine the ray angle of casting acording to player field of view
    let rayAngle = player.get('angle') - fovAngle / 2;

    // Cast debug Ray
    castDebugRay();

    // Cast the rays
    new Array(raysQuantity).fill('').forEach((_, ray) => {
      // Cast rays
      const {
        rayX,
        rayY,
        distance,
        objectId,
        pixelOfTexture,
        horizontalRay,
        mapX,
        mapY,
      } = castRays({
        rayAngle,
      });

      list.push({
        rayX,
        rayY,
        rayAngle,
        distance,
        objectId,
        pixelOfTexture,
        horizontalRay,
        mapX,
        mapY,
        rayNumber: ray,
      });

      // Store casted ray distance on X position
      rayDistances[ray] = distance ? distance : 9999999;

      // Increase angle for next ray
      rayAngle += fovAngle / raysQuantity;
    });

    // Finaly render everything found
    return renderEverything(list, rayDistances);
  };

  return {
    render,
  };
};

export default RayCasting;
