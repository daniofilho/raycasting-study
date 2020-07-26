// All texture sizes must be equal to Tile size width and height!
export default {
  // # "Floors"
  floor: {
    image: 'assets/floor-test.jpg',
    isWall: false,
    isObject: false,
    isCollidable: false,
    isLight: false,
  },
  // # "Walls"
  wall: {
    image: 'assets/wall.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
    isLight: false,
  },
  stone: {
    image: 'assets/stone.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
    isLight: false,
  },
  jail: {
    image: 'assets/jail.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
    isLight: false,
  },
  wood: {
    image: 'assets/wood.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
    isLight: false,
  },
  // # Objects
  table: {
    image: 'assets/table.png',
    isWall: false,
    isObject: true,
    isCollidable: true,
    isLight: false,
  },
  lamp: {
    image: 'assets/lamp.png',
    isWall: false,
    isObject: true,
    isCollidable: false,
    isLight: true,
  },
  pillar: {
    image: 'assets/pillar.png',
    isWall: false,
    isObject: true,
    isCollidable: true,
    isLight: false,
  },
  barrel: {
    image: 'assets/barrel.png',
    isWall: false,
    isObject: true,
    isCollidable: true,
    isLight: false,
  },
};
