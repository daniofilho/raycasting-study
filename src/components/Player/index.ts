import * as config from '../../config';
import { MiniMapType } from '../MiniMap/types';
import { ScreenType } from '../Screen/types';
import { TextureType, TexturesType } from '../Textures/types';

import Collision from '../../engine/Collision';

const Player = (
  minimap: MiniMapType,
  debugmap: MiniMapType,
  screen: ScreenType,
  textures: TexturesType
) => {
  // Constructor
  const props = {
    minimap,
    debugmap,
    screen,
    width: config.player.width,
    height: config.player.height,
    x: config.player.x,
    y: config.player.y,
    deltaX: Math.cos(2 * Math.PI) * 5,
    deltaY: Math.sin(2 * Math.PI) * 5,
    angle: 5.98,
    turnSpeed: config.player.turnSpeed,
    speed: config.player.speed,
    fieldOfView: config.player.fieldOfView,
  };

  const tiles = config.scenario.tiles;
  const tileSize = config.scenario.tileSize;

  const scenarioWidth = config.scenario.tilesX * tileSize;
  const scenarioHeight = config.scenario.tilesY * tileSize;

  const isPlayerCollidingWall = (x: number, y: number) => {
    const collision = Collision();
    let isColliding = false;

    // Check collision against all objects
    new Array(config.scenario.tilesX).fill('').forEach((_, spriteX) => {
      new Array(config.scenario.tilesY).fill('').forEach((_, spriteY) => {
        const mapPosition = spriteY * config.scenario.tilesX + spriteX;
        const objectId = tiles[mapPosition];
        const objectTexture: TextureType = textures.get(objectId);

        if (!objectTexture) return;
        if (!objectTexture.isCollidable) return;

        // Check Tile on position
        const mapX = spriteX * tileSize;
        const mapY = spriteY * tileSize;

        const collisionX = x - props.width / 2;
        const collisionY = y - props.height / 2;

        const collided = collision.check({
          object: {
            x: collisionX,
            y: collisionY,
            width: props.width,
            height: props.height,
          },
          target: {
            x: mapX,
            y: mapY,
            width: tileSize,
            height: tileSize,
          },
        });

        if (collided) {
          isColliding = collided;
          return true; // end loop
        }

        // Debug information
        debugmap.drawRectangle({
          x: collisionX,
          y: collisionY,
          width: props.width,
          height: props.height,
          color: 'rgba(0,0,200, 0.5)',
        });
        debugmap.drawRectangle({
          x: mapX,
          y: mapY,
          width: tileSize,
          height: tileSize,
          color: 'rgba(255,100,100,0.5)',
        });
      });
    });
    return isColliding;
  };

  // Middlwares for setting props
  const setX = (x: number) => {
    let newX = x;

    // limit player
    if (newX > scenarioWidth) newX = scenarioWidth;
    if (newX < 0) newX = 0;

    // Check collision before set
    const isColliding = isPlayerCollidingWall(newX, props.y);

    if (!isColliding) props.x = newX;
  };
  const setY = (y: number) => {
    let newY = y;

    // limit player
    if (newY > scenarioHeight) newY = scenarioHeight;
    if (newY < 0) newY = 0;

    // Check collision before set
    const isColliding = isPlayerCollidingWall(props.x, newY);

    if (!isColliding) props.y = newY;
  };
  const setAngle = (angle: number) => {
    props.angle = angle;
  };
  const setDeltaX = (x: number) => {
    props.deltaX = x;
  };
  const setDeltaY = (y: number) => {
    props.deltaY = y;
  };

  const get = (prop: string) => {
    return props[prop];
  };

  // Player movements
  const goFront = () => {
    const { x, y, deltaX, deltaY, speed } = props;

    setX(x + speed * deltaX);
    setY(y + speed * deltaY);
  };
  const goBack = () => {
    const { x, y, deltaX, deltaY, speed } = props;

    setX(x - speed * deltaX);
    setY(y - speed * deltaY);
  };
  const turnLeft = () => {
    const { angle, turnSpeed } = props;

    // Define angle
    let newAngle = angle - turnSpeed;
    if (newAngle < 0) newAngle = angle + 2 * Math.PI; // invert

    setAngle(newAngle);

    // Deltas
    setDeltaX(Math.cos(newAngle) * 5);
    setDeltaY(Math.sin(newAngle) * 5);
  };
  const turnRight = () => {
    const { angle, turnSpeed } = props;

    // Define angle
    let newAngle = angle + turnSpeed;
    if (newAngle > 2 * Math.PI) newAngle = angle - 2 * Math.PI;

    setAngle(newAngle);

    // Deltas
    setDeltaX(Math.cos(newAngle) * 5);
    setDeltaY(Math.sin(newAngle) * 5);
  };
  const strafeLeft = () => {
    const { x, y, speed, angle } = props;

    const leftAngle = 90 * (Math.PI / 180);
    const newAngle = angle - leftAngle;

    const deltaX = Math.cos(newAngle) * 5;
    const deltaY = Math.sin(newAngle) * 5;

    setX(x + (speed / 2) * deltaX);
    setY(y + (speed / 2) * deltaY);
  };
  const strafeRight = () => {
    const { x, y, speed, angle } = props;

    const leftAngle = 90 * (Math.PI / 180);
    const newAngle = angle + leftAngle;

    const deltaX = Math.cos(newAngle) * 5;
    const deltaY = Math.sin(newAngle) * 5;

    setX(x + (speed / 2) * deltaX);
    setY(y + (speed / 2) * deltaY);
  };

  // Actions on key press
  const handleKeyUp = (keyCodes: Array<number>) => {
    if (keyCodes[39]) turnRight(); // arrow right
    if (keyCodes[37]) turnLeft(); // arrow left
    if (keyCodes[83]) goBack(); // S
    if (keyCodes[87]) goFront(); // W
    if (keyCodes[65]) strafeLeft(); // A
    if (keyCodes[68]) strafeRight(); // D
  };

  // Render the player
  const render = (keyCodes: any) => {
    const { x, y, deltaX, deltaY } = props;
    const { width, color } = config.player;
    handleKeyUp(keyCodes);

    // player body
    //props.canvas.drawRectangle({ x, y, width, height, color });
    props.minimap.drawElipse({ x, y, radius: width, color });
    props.debugmap.drawElipse({ x, y, radius: width, color });

    // player eye direction
    props.minimap.drawLine({
      x,
      y,
      toX: x + deltaX * 5,
      toY: y + deltaY * 5,
      color: '#FF0000',
    });
    props.debugmap.drawLine({
      x,
      y,
      toX: x + deltaX * 5,
      toY: y + deltaY * 5,
      color: '#FF0000',
    });
  };

  // Return all public functions
  return {
    render,
    get,
  };
};

export default Player;
