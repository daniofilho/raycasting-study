export interface ScenarioPropType {
  tileSize: number;
  tilesX: number;
  tilesY: number;
  map: Array<Array<string>>;
  screen: {
    sky: {
      image: HTMLImageElement;
      width: number;
      height: number;
    };
  };
}

export interface ScenarioType {
  getConfig(prop: string): any;
  getConfigs: ScenarioPropType;
  render: Function;
  getTiles: Function;
}
