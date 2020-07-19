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
    ...config.player,
    ...{
      minimap,
      debugmap,
      screen,
      jump: 0,
      jumpSpeed: 0,
      speed: 0,
      turnSpeed: 0,
      look: 0,
      lookSpeed: 0,
      moveDirection: 0,
    },
  };

  const { tileSize, map } = config.scenario;

  /*const isPlayerCollidingWall = (x: number, y: number) => {
    const collision = Collision();
    let isColliding = false;

    // Check collision against all objects
    new Array(config.scenario.tilesX).fill('').forEach((_, spriteX) => {
      new Array(config.scenario.tilesY).fill('').forEach((_, spriteY) => {
        const mapPosition = spriteY * config.scenario.tilesX + spriteX;
        const objectId = map[mapPosition];
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
  */

  // Middlwares for setting props
  const setX = (x: number) => {
    props.x = x;
  };
  const setY = (y: number) => {
    props.y = y;
  };

  const get = (prop: string) => {
    return props[prop];
  };

  const turn = (turn: number, look: number) => {
    props.look += look;
    if (props.look > 1000) props.look = 1000;
    if (props.look < -1000) props.look = -1000;

    props.pod += turn;
    if (props.pod >= 360) props.pod -= 360;
    if (props.pod < 0) props.pod += 360;
  };

  const move = () => {
    if (props.speed === 0) return;
    const speedMultiplier = 40;

    const speed = (props.speed * speedMultiplier) / 10;
    const deviation = props.size / 2;
    const block = tileSize;

    let newx = props.x + Math.cos((props.pod + props.moveDirection) * (Math.PI / 180)) * speed;
    let newy = props.y + Math.sin((props.pod + props.moveDirection) * (Math.PI / 180)) * speed;

    // Colission
    if (
      !(
        map[Math.floor((newy + deviation) / block)][Math.floor((newx + deviation) / block)] !==
          'floor' ||
        map[Math.floor((newy - deviation) / block)][Math.floor((newx - deviation) / block)] !==
          'floor' ||
        map[Math.floor((newy + deviation) / block)][Math.floor((newx - deviation) / block)] !==
          'floor' ||
        map[Math.floor((newy - deviation) / block)][Math.floor((newx + deviation) / block)] !==
          'floor' ||
        map[Math.floor(newy / block)][Math.floor(newx / block)] !== 'floor'
      )
    ) {
      props.x = newx;
      props.y = newy;
    }
  };

  const goFront = () => {
    props.speed = 1;
    props.moveDirection = 0;
    move();
  };
  const goBack = () => {
    props.speed = 0.75;
    props.moveDirection = 180;
    move();
  };
  const strafeLeft = () => {
    props.speed = 0.75;
    props.moveDirection = 270;
    move();
  };
  const strafeRight = () => {
    props.speed = 0.75;
    props.moveDirection = 90;
    move();
  };

  const turnRight = () => {
    props.turnSpeed = 2;
    turn(props.turnSpeed, 5);
  };

  const turnLeft = () => {
    props.turnSpeed = -2;
    turn(props.turnSpeed, 5);
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
    const { x, y, size, look, pod } = props;
    //const { width, color } = config.player;
    handleKeyUp(keyCodes);

    // player body
    //props.canvas.drawRectangle({ x, y, width, height, color });
    props.minimap.drawElipse({ x, y, radius: size, color: '#FF0' });
    props.debugmap.drawElipse({
      x,
      y,
      radius: size,
      color: '#FF0',
    });

    // player eye direction
    props.minimap.drawLine({
      x,
      y,
      toX: x + look * 5,
      toY: y + pod * 5,
      color: '#FF0000',
    });
    props.debugmap.drawLine({
      x,
      y,
      toX: x + look * 5,
      toY: y + pod * 5,
      color: '#FF0000',
    });
  };

  // Render everything that needs to render after everything finished render
  const postRender = () => {};

  // Return all public functions
  return {
    render,
    postRender,
    get,
  };
};

export default Player;
