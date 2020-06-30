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

  const tiles = config.scenario.tiles;
  const tileSize = config.scenario.tileSize;

  const scenarioWidth = config.scenario.tilesX * tileSize;
  const scenarioHeight = config.scenario.tilesY * tileSize;

  const isPlayerCollidingWall = (x: number, y: number) => {
    // # Simple Check, based on tile number

    // Check Tile on position
    const mapX = Math.floor(x / tileSize);
    const mapY = Math.floor(y / tileSize);
    const mapPosition = mapY * config.scenario.tilesX + mapX;

    return tiles[mapPosition] !== 0;
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
