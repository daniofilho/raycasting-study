import React, { useState, useEffect } from 'react';

import { getTexture } from 'lib/common';

import { Container } from './styles';

interface CellType {
  selectedTexture: string;
  index: number;
  w: number;
  h: number;
  mapHeight: number;
  mapWidth: number;
  updateMap: Function;
}

const Cell: React.FC<CellType> = ({
  index,
  selectedTexture,
  w,
  h,
  mapHeight,
  mapWidth,
  updateMap,
}) => {
  // Define walls on edges by default
  let initialTexture = 'floor';
  if (w === 0 || w === mapWidth - 1) initialTexture = 'wall';
  if (h === 0 || h === mapHeight - 1) initialTexture = 'wall';

  const [texture, setTexture] = useState<string>(initialTexture);

  const changeTexture = () => {
    setTexture(selectedTexture);
  };

  useEffect(() => {
    updateMap(index, getTexture(texture).id);
  }, [texture]);

  return (
    <Container onClick={() => changeTexture()}>
      <img src={getTexture(texture).image} alt="texture" />
    </Container>
  );
};

export default Cell;
