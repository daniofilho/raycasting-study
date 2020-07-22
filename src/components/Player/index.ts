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
      fov: config.player.fov * (Math.PI / 180),
      // canvas
      minimap,
      debugmap,
      screen,
      // jump props
      isJumping: false,
      jump: 0, // controls player position relative to floor
      jumpVelocity: 0,
      // crouch props
      isCrouching: false,
      // look props
      look: 0,
      moveDirection: 0,
      deltaX: Math.cos(config.player.pod * (Math.PI / 180)),
      deltaY: Math.sin(config.player.pod * (Math.PI / 180)),
    },
  };

  const { tileSize, map } = config.scenario;

  const isPlayerCollidingWall = (x: number, y: number) => {
    const deviation = props.size / 2;
    const block = tileSize;

    if (
      !(
        map[Math.floor((y + deviation) / block)][Math.floor((x + deviation) / block)] !== 'floor' ||
        map[Math.floor((y - deviation) / block)][Math.floor((x - deviation) / block)] !== 'floor' ||
        map[Math.floor((y + deviation) / block)][Math.floor((x - deviation) / block)] !== 'floor' ||
        map[Math.floor((y - deviation) / block)][Math.floor((x + deviation) / block)] !== 'floor' ||
        map[Math.floor(y / block)][Math.floor(x / block)] !== 'floor'
      )
    ) {
      return false;
    }

    // Debug information
    /*debugmap.drawRectangle({
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
    });*/
    return true;
  };

  // Middlwares for setting props
  const setX = (x: number) => {
    if (!isPlayerCollidingWall(x, props.y)) props.x = x;
  };
  const setY = (y: number) => {
    if (!isPlayerCollidingWall(props.x, y)) props.y = y;
  };

  const get = (prop: string) => {
    return props[prop];
  };

  // # Movement
  const turn = (direction: number) => {
    props.pod += props.turnSpeed * direction;
    if (props.pod >= 360) props.pod -= 360;
    if (props.pod < 0) props.pod += 360;

    props.deltaX = Math.cos(props.pod * (Math.PI / 180));
    props.deltaY = Math.sin(props.pod * (Math.PI / 180));
  };

  const look = (direction: number) => {
    props.look += props.turnSpeed * direction * 3;
    if (props.look > 80) props.look = 80;
    if (props.look < -80) props.look = -80;
  };

  const move = (_speed: number) => {
    const speed = _speed * props.speed;

    let newX = props.x + Math.cos((props.pod + props.moveDirection) * (Math.PI / 180)) * speed;
    let newY = props.y + Math.sin((props.pod + props.moveDirection) * (Math.PI / 180)) * speed;

    // Colission
    setX(newX);
    setY(newY);
  };

  // # Walk
  const goFront = () => {
    props.moveDirection = 0;
    move(1);
  };
  const goBack = () => {
    props.moveDirection = 180;
    move(0.75);
  };

  // # Strafe
  const strafeLeft = () => {
    props.moveDirection = 270;
    move(0.75);
  };
  const strafeRight = () => {
    props.moveDirection = 90;
    move(0.75);
  };

  // # Turn
  const turnRight = () => {
    turn(1);
  };
  const turnLeft = () => {
    turn(-1);
  };

  // # Look
  const lookUp = () => {
    look(1);
  };
  const lookDown = () => {
    look(-1);
  };

  // # Jump
  const jump = () => {
    if (props.isJumping) return;
    props.isJumping = true;
    props.jumpVelocity = props.jumpSpeed;
  };
  const applyGravity = () => {
    props.jump += props.jumpVelocity;
    props.jumpVelocity -= config.game.gravity;

    // Limit player on ground
    if (props.jump <= 0 && props.isJumping) {
      props.isJumping = false;
      props.jump = 0;
    }
  };

  // # Crouch
  const crouch = () => {
    if (props.isJumping) return;

    if (props.isCrouching) {
      props.jump = -20;
    } else {
      props.jump = 0;
    }
  };

  // Actions on key press
  const handleKeyUp = (keyCodes: Array<number>) => {
    if (keyCodes[39]) turnRight(); // arrow right
    if (keyCodes[37]) turnLeft(); // arrow left
    if (keyCodes[83]) goBack(); // S
    if (keyCodes[87]) goFront(); // W
    if (keyCodes[65]) strafeLeft(); // A
    if (keyCodes[68]) strafeRight(); // D
    if (keyCodes[69]) lookUp(); // E
    if (keyCodes[67]) lookDown(); // C
    if (keyCodes[32]) jump(); // Space

    // Toggle Crouch if Z is pressed
    props.isCrouching = keyCodes[90] ? true : false;
  };

  // Render the player
  const render = (keyCodes: any) => {
    const { x, y, size, deltaX, deltaY } = props;
    handleKeyUp(keyCodes);

    applyGravity();
    crouch();

    // player body
    props.minimap.drawElipse({ x, y, radius: size, color: '#BBFF00' });
    props.debugmap.drawElipse({
      x,
      y,
      radius: size,
      color: '#BBFF00',
    });

    // player eye direction - single ray debug
    props.debugmap.drawLine({
      x,
      y,
      toX: x + deltaX * config.screen.width,
      toY: y + deltaY * config.screen.height,
      color: '#BBFF00',
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
