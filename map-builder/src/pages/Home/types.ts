export type mapType = Array<string>;

export interface stateType {
  mapWidth: number;
  mapHeight: number;
  selectedTexture: string;
  map: mapType;
}

export interface actionsType {
  setMapWidth: Function;
  setMapHeight: Function;
  setSelectedTexture: Function;
  setMap: Function;
}

export interface actionsGenericType {
  [key: string]: Function;
}

export interface actionType {
  params: any;
  type: any;
}

export interface reducerType {
  state: stateType;
  actions: actionsType;
}

export interface HomeType {
  reducer: reducerType;
  renderGrid: Function;
  outputMap: Function;
}
