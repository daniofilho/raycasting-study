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
  },
};
