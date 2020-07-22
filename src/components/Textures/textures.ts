// All texture sizes must be equal to Tile size width and height!
export default {
  // # "Walls"
  wall: {
    image: 'assets/walls.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  stone: {
    image: 'assets/stone.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  jail: {
    image: 'assets/jail.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  wood: {
    image: 'assets/wood.png',
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  // # Objects
  table: {
    image: 'assets/table.png',
    isWall: false,
    isObject: true,
    isCollidable: true,
  },
  lamp: {
    image: 'assets/lamp.png',
    isWall: false,
    isObject: true,
    isCollidable: false,
  },
  pillar: {
    image: 'assets/pillar.png',
    isWall: false,
    isObject: true,
    isCollidable: true,
  },
  barrel: {
    image: 'assets/barrel.png',
    isWall: false,
    isObject: true,
    isCollidable: true,
  },
};
