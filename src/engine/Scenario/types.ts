import { rgbType } from '../../types';
export interface ScenarioType {
  render: Function;
  getTiles: Function;
}

export interface ScenarioPropType {
  tileSize: number;
  tilesX: number;
  tilesY: number;
  tiles: Array<any>;
  minimap: {
    wall: { color: string };
    floor: { color: string };
  };
  screen: {
    sky: {
      color: rgbType;
      image: HTMLImageElement;
    };
    floor: {
      color: {
        from: string;
        to: string;
      };
      image: HTMLImageElement;
    };
  };
}
