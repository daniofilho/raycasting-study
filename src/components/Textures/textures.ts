// All texture sizes must be equal to Tile size!
export default {
  wall: {
    image: 'assets/walls.png',
    horizontal: {
      clipX: 0,
      clipY: 0,
    },
    vertical: {
      clipX: 64,
      clipY: 0,
    },
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  stone: {
    image: 'assets/walls.png',
    horizontal: {
      clipX: 0,
      clipY: 128,
    },
    vertical: {
      clipX: 64,
      clipY: 128,
    },
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  jail: {
    image: 'assets/walls.png',
    horizontal: {
      clipX: 0,
      clipY: 64,
    },
    vertical: {
      clipX: 64,
      clipY: 64,
    },
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  wood: {
    image: 'assets/walls.png',
    horizontal: {
      clipX: 0,
      clipY: 192,
    },
    vertical: {
      clipX: 64,
      clipY: 192,
    },
    isWall: true,
    isObject: false,
    isCollidable: true,
  },
  table: {
    image: 'assets/test-sprite.jpg',
    horizontal: {
      clipX: 0,
      clipY: 0,
    },
    vertical: {
      clipX: 0,
      clipY: 0,
    },
    isWall: false,
    isObject: true,
    isCollidable: true,
  },
  lamp: {
    image: 'assets/test-sprite.jpg',
    horizontal: {
      clipX: 0,
      clipY: 0,
    },
    vertical: {
      clipX: 0,
      clipY: 0,
    },
    isWall: false,
    isObject: true,
    isCollidable: false,
  },
};
