import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
  }

  html, body, #app {
    height: 100%;
    background: #999;
  }
`;

export default GlobalStyle;
