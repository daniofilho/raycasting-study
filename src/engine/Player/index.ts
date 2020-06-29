import * as config from '../../config';
import { MiniMapType } from '../MiniMap/types';
import { ScreenType } from '../Screen/types';

const Player = (minimap: MiniMapType, debugmap: MiniMapType, screen: ScreenType) => {
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
    angle: 0,
    turnSpeed: config.player.turnSpeed,
    speed: config.player.speed,
    fieldOfView: config.player.fieldOfView,
  };

  const scenarioWidth = config.scenario.tilesX * config.scenario.tileSize;
  const scenarioHeight = config.scenario.tilesY * config.scenario.tileSize;

  // Middlwares for setting props
  const setX = (x: number) => {
    let newX = x;

    // limit player
    if (newX > scenarioWidth) newX = scenarioWidth;
    if (newX < 0) newX = 0;

    props.x = newX;
  };
  const setY = (y: number) => {
    let newY = y;

    // limit player
    if (newY > scenarioHeight) newY = scenarioHeight;
    if (newY < 0) newY = 0;

    props.y = newY;
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

  // Actions on key press
  const handleKeyUp = (keyCodes: Array<number>) => {
    if (keyCodes[39]) turnRight();
    if (keyCodes[37]) turnLeft();
    if (keyCodes[40]) goBack();
    if (keyCodes[38]) goFront();

    // @TODO strafe left and right
  };

  // Render the player
  const render = (keyCodes: any) => {
    const { x, y, deltaX, deltaY } = props;
    const { width, height, color } = config.player;
    handleKeyUp(keyCodes);

    // player body
    //props.canvas.drawRectangle({ x, y, width, height, color });
    props.minimap.canvas.drawElipse({ x, y, radius: width, color });
    props.debugmap.canvas.drawElipse({ x, y, radius: width, color });

    // player eye direction
    props.minimap.canvas.drawLine({
      x,
      y,
      toX: x + deltaX * 5,
      toY: y + deltaY * 5,
      color: '#FF0000',
    });
    props.debugmap.canvas.drawLine({
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
