import React, { useReducer, useEffect } from 'react';

import Cell from 'components/Cell';

import { HomeType, reducerType, mapType } from './types';

import * as HomeReducer from './reducer';
import mapReducerActions from 'lib/mapReducerActions';

export default (WrappedComponent: React.FC<HomeType>) => {
  const HOC = () => {
    // # Reducer

    const [state, dispatch] = useReducer(
      HomeReducer.reducer,
      HomeReducer.INITIAL_STATE,
    );
    const reducer: reducerType = {
      state,
      actions: mapReducerActions(HomeReducer.actions, dispatch),
    };

    const {
      state: { mapWidth, mapHeight, map },
      actions: { setMap },
    } = reducer;

    // # Regras

    const resetMap = () => {
      const _map: Partial<mapType> = [];

      let index = 0;
      new Array(mapWidth).fill('').map((_, w) => {
        return new Array(mapHeight).fill('').map((_, h) => {
          // Define walls on edges by default
          let texture = 'floor';
          if (w === 0 || w === mapWidth - 1) texture = 'wall';
          if (h === 0 || h === mapHeight - 1) texture = 'wall';

          _map[index] = texture;

          return index++;
        });
      });

      setMap(_map);
    };

    // Reset map when change map size
    useEffect(() => {
      resetMap();
      // eslint-disable-next-line
    }, [mapWidth, mapHeight]);

    const updateMap = (index: number, type: string) => {
      const auxMap = [...map];
      let i = 0;
      new Array(mapWidth).fill('').map((w) => {
        return new Array(mapHeight).fill('').map((h) => {
          if (i === index) auxMap[index] = type;
          return i++;
        });
      });

      setMap(auxMap);
    };

    const renderGrid = () => {
      let index = 0;
      return new Array(mapWidth).fill('').map((_, w) => {
        return (
          <div key={w}>
            {new Array(mapHeight).fill('').map((_, h) => {
              const r = (
                <Cell
                  key={`${w}${h}`}
                  index={index}
                  updateMap={updateMap}
                  reducer={reducer}
                />
              );
              index++;
              return r;
            })}
          </div>
        );
      });
    };

    const outputMap = () => {
      let string = '[';

      map.map((m: string) => {
        string += m + ', ';
        return true;
      });
      string += ']';
      return <textarea value={string} readOnly />;
    };

    return (
      <WrappedComponent
        reducer={reducer}
        renderGrid={renderGrid}
        outputMap={outputMap}
      />
    );
  };
  return HOC;
};
