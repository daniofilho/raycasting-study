import styled from 'styled-components';

export const Container = styled.div`
  .tileSelector {
    display: flex;
    div {
      cursor: pointer;
    }
  }
  .result {
    textarea {
      height: 400px;
      width: 100%;
    }
  }
`;

interface GridType {
  mapWidth: number;
}

export const Grid = styled.div<GridType>`
  display: grid;
  box-sizing: border-box;
  max-width: 90vw;
  margin: 20px auto;

  & > div {
    display: grid;
    grid-template-columns: repeat(${(props: GridType) => props.mapWidth}, 1fr);
  }
`;
