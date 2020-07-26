import * as config from '../../config/config';

import { MiniMapType } from '../MiniMap/types';
import { ScreenType } from '../Screen/types';
import { TextureType, TexturesType } from '../Textures/types';
import { ScenarioPropType } from '../Scenario/types';

import Collision from '../Collision';
import { truncate } from 'fs';

const Player = (
  minimap: MiniMapType,
  debugmap: MiniMapType,
  screen: ScreenType,
  textures: TexturesType,
  configScenario: ScenarioPropType
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

      dirX: 1,
      dirY: 0,
      planeX: 0,
      planeY: 0.9,
    },
  };

  const { tileSize, map } = configScenario;

  const canvasWidth = screen.getConfig('width');
  const canvasHeight = screen.getConfig('height');

  const isPlayerColliding = (x: number, y: number) => {
    const deviation = props.size / 2;
    const block = tileSize;

    // Check if there is an object inside next coordinates
    const target1 = textures.get(
      map[Math.floor((y + deviation) / block)][Math.floor((x + deviation) / block)]
    );
    const target2 = textures.get(
      map[Math.floor((y - deviation) / block)][Math.floor((x - deviation) / block)]
    );
    const target3 = textures.get(
      map[Math.floor((y + deviation) / block)][Math.floor((x - deviation) / block)]
    );
    const target4 = textures.get(
      map[Math.floor((y - deviation) / block)][Math.floor((x + deviation) / block)]
    );
    const target5 = textures.get(map[Math.floor(y / block)][Math.floor(x / block)]);

    if (
      !(
        target1.isCollidable ||
        target2.isCollidable ||
        target3.isCollidable ||
        target4.isCollidable ||
        target5.isCollidable
      )
    ) {
      return false;
    }

    return true;
  };

  // Middlwares for setting props
  const setX = (x: number) => {
    if (!isPlayerColliding(x, props.y)) props.x = x;
  };
  const setY = (y: number) => {
    if (!isPlayerColliding(props.x, y)) props.y = y;
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

    const rotSpeed = props.turnSpeed * 0.0175 * -direction; // turnspeed * direction;

    const oldDirX = props.dirX;
    props.dirX = props.dirX * Math.cos(-rotSpeed) - props.dirY * Math.sin(-rotSpeed);
    props.dirY = oldDirX * Math.sin(-rotSpeed) + props.dirY * Math.cos(-rotSpeed);

    const oldPlaneX = props.planeX;
    props.planeX = props.planeX * Math.cos(-rotSpeed) - props.planeY * Math.sin(-rotSpeed);
    props.planeY = oldPlaneX * Math.sin(-rotSpeed) + props.planeY * Math.cos(-rotSpeed);
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
    move(0.25);
  };
  const strafeRight = () => {
    props.moveDirection = 90;
    move(0.25);
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
      props.jump = screen.getConfig('height') / 1000 - 10;
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

  // Draw player body on inimaps
  const drawPlayerBody = () => {
    if (!window.global.renderTextures) return;
    const { x, y, size } = props;

    props.minimap.drawElipse({ x, y, radius: size, color: '#F00', fillColor: '#F00' });
    props.debugmap.drawElipse({
      x,
      y,
      radius: size,
      color: '#F00',
      fillColor: '#F00',
    });
  };

  // Render the player
  const render = (keyCodes: Array<number>) => {
    handleKeyUp(keyCodes);
    drawPlayerBody();
    applyGravity();
    crouch();
  };

  // Render everything that needs to render after everything finished render
  const postRender = () => {
    if (!window.global.renderTextures) return;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Player sprite
    const { gun } = config.player;
    props.screen.drawImage({
      x: centerX - gun.width / 2,
      y: canvasHeight - gun.height,
      image: gun.image,
      width: gun.width,
      height: gun.height,
    });

    // Player crosshair
    const { crosshair } = config.player;
    props.screen.drawImage({
      x: centerX - crosshair.width / 2,
      y: centerY - crosshair.height / 2,
      image: crosshair.image,
      width: crosshair.width,
      height: crosshair.height,
    });
  };

  // Return all public functions
  return {
    render,
    postRender,
    get,
  };
};

export default Player;
