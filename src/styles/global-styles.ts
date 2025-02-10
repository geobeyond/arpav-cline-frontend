import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
import 'typeface-titillium-web';

/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Titillium Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding-top: ${StyleConstants.NAV_BAR_HEIGHT};
    background-color: ${p => p.theme.background};
  }

  body.fontLoaded {
    font-family: 'Titillium Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .it-head-wrapper{
    font-family: 'Titillium Web', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  }

  .green a{
    color: #164d36;
  }
  
`;
