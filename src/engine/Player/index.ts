import * as config from '../../config';
import { CanvasType } from '../Canvas/types';

const Player = (canvas: CanvasType) => {
  // Constructor
  const props = {
    canvas,
    x: config.player.x,
    y: config.player.y,
    deltaX: Math.cos(2 * Math.PI) * 5,
    deltaY: Math.sin(2 * Math.PI) * 5,
    angle: 0,
  };

  // Middlwares for setting props
  const setX = (x: number) => {
    props.x = x;
  };
  const setY = (y: number) => {
    props.y = y;
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
    const { x, y, deltaX, deltaY } = props;

    setX(x + config.player.speed * deltaX);
    setY(y + config.player.speed * deltaY);
  };
  const goBack = () => {
    const { x, y, deltaX, deltaY } = props;

    setX(x - config.player.speed * deltaX);
    setY(y - config.player.speed * deltaY);
  };
  const turnLeft = () => {
    const { angle } = props;

    // Define angle
    let newAngle = angle - 0.05;
    if (newAngle < 0) newAngle = angle + 2 * Math.PI;

    setAngle(newAngle);

    // Deltas
    setDeltaX(Math.cos(newAngle) * 5);
    setDeltaY(Math.sin(newAngle) * 5);
  };
  const turnRight = () => {
    const { angle } = props;

    // Define angle
    let newAngle = angle + 0.05;
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
    //props.canvas.drawRectangle(x, y, width, height, color);
    props.canvas.drawElipse(x, y, width, color);

    // player eye direction
    props.canvas.drawLine(x, y, x + deltaX * 5, y + deltaY * 5, '#FF0000');
  };

  // Return all public functions
  return {
    render,
    get,
  };
};

export default Player;
