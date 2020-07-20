import immer from 'immer';

import { stateType, actionType, actionsGenericType } from './types';

const INITIAL_STATE = {
  mapWidth: 10,
  mapHeight: 10,
  selectedTexture: 'wall',
  map: [],
};

const actions: actionsGenericType = {
  setMapWidth: (state: stateType, action: actionType) => {
    state.mapWidth = action.params;
  },
  setMapHeight: (state: stateType, action: actionType) => {
    state.mapHeight = action.params;
  },
  setSelectedTexture: (state: stateType, action: actionType) => {
    state.selectedTexture = action.params;
  },
  setMap: (state: stateType, action: actionType) => {
    state.map = action.params;
  },
};

function reducer(state: stateType, action: actionType) {
  const fn = actions[action.type];
  if (fn)
    return immer(state, (draftState: stateType) => fn(draftState, action));

  return state;
}

export { INITIAL_STATE, actions, reducer };
