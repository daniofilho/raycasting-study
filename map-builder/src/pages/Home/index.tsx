import React, { useState } from 'react';

import Cell from 'components/Cell';

import { textures, textureType } from 'textures';

import { Container, Grid } from './styles';

const Home: React.FC = () => {
  const [mapWidth, setMapWidth] = useState<number>(10);
  const [mapHeight, setMapHeight] = useState<number>(10);

  const [selectedTexture, setSelectedTexture] = useState<string>('wall');

  const [map, setMap] = useState<Array<string>>([]);

  const updateMap = (index: number, type: string) => {
    setMap((oldState) => {
      const auxMap = oldState;
      let i = 0;
      new Array(mapWidth).fill('').map((w) => {
        return new Array(mapHeight).fill('').map((h) => {
          if (i === index) auxMap[index] = type;
          i++;
        });
      });
      return auxMap;
    });
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
                w={w}
                h={h}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                selectedTexture={selectedTexture}
                index={index}
                updateMap={updateMap}
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
    });
    string += ']';
    return <textarea value={string} readOnly />;
  };

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

      <div className="result">{outputMap()}</div>
    </Container>
  );
};

export default Home;
