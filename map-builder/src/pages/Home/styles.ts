import styled from 'styled-components';

export const Container = styled.div`
  .tileSelector {
    display: flex;
    div {
      cursor: pointer;
    }
  }
`;

interface GridType {
  mapWidth: number;
}

export const Grid = styled.div<GridType>`
  display: grid;
  box-sizing: border-box;
  max-width: 1000px;
  margin: 20px auto;

  & > div {
    display: grid;
    grid-template-columns: repeat(${(props) => props.mapWidth}, 1fr);
  }
`;
