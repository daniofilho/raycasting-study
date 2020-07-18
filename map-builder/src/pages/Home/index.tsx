import React from 'react';

import { textures, textureType } from 'textures';

import HOC from './HOC';
import { HomeType } from './types';
import { Container, Grid } from './styles';

const Home: React.FC<HomeType> = ({ reducer, renderGrid, outputMap }) => {
  const {
    state: { mapWidth, mapHeight },
    actions: { setMapWidth, setMapHeight, setSelectedTexture },
  } = reducer;

  return (
    <Container>
      <div className="inputs">
        <h1>Map Properties</h1>
        <input
          type="text"
          value={mapWidth}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            const n = parseInt(e.target.value, 10);
            setMapWidth(n || 0);
          }}
        />
        x
        <input
          type="text"
          value={mapHeight}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            const n = parseInt(e.target.value, 10);
            setMapHeight(n || 0);
          }}
        />
      </div>

      <div className="tileSelector">
        <h1>Select your tile</h1>
        {textures.map((t: textureType) => (
          <div key={t.id} onClick={() => setSelectedTexture(t.id)}>
            <img src={t.image} alt={t.id} />
          </div>
        ))}
      </div>

      <Grid mapWidth={mapWidth}>{renderGrid()}</Grid>

      <div className="result">
        <h1>Result:</h1>
        {outputMap()}
      </div>
    </Container>
  );
};

export default HOC(Home);
