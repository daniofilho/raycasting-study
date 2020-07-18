import React from 'react';

import { getTexture } from 'lib/common';

import { reducerType } from 'pages/Home/types';

import { Container } from './styles';

interface CellType {
  index: number;
  updateMap: Function;
  reducer: reducerType;
}

const Cell: React.FC<CellType> = ({ index, reducer, updateMap }) => {
  const {
    state: { selectedTexture, map },
  } = reducer;
  const texture = map[index];

  const changeTexture = () => {
    updateMap(index, getTexture(selectedTexture).id);
  };

  return (
    <Container onClick={() => changeTexture()}>
      <img src={getTexture(texture).image} alt="texture" />
    </Container>
  );
};

export default Cell;
