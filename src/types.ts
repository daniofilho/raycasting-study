/* CONFIG */

export interface GameType {
  fps: number;
  gravity: number;
  render: {
    wallHeight: number;
    maxDistanceVisible: number;
  };
}
