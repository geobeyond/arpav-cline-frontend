# Piattaforma Proiezioni Climatiche per il Nord-Est

This is the frontend component of the ARPAV-PPCV system.

#### Climate Projections Platform for North-Eastern Italy

[![Piattaforma Proiezioni Climatiche per il Nord-Est](https://github.com/inkode-it/Arpav-PPCV/raw/main/public/img/screenshot.png)](https://clima.arpa.veneto.it/)

## About
This work is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by-sa/3.0/it/deed.en">Creative Commons Attribution-ShareAlike 3.0 IT License</a>.
<br/><a rel="license" href="https://creativecommons.org/licenses/by-sa/3.0/it/deed.en"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a>

Commissioned by & Data credits to <br/>
<a href="https://www.arpa.veneto.it/"><img src="https://github.com/inkode-it/Arpav-PPCV/raw/main/public/img/logo_arpav.png" alt="ARPAV" style="background-color:white;padding:4px"></a>

Designed and developed in Italy by <br/>
<a rel="author" href="mailto:info@inkode.it"><img src="https://avatars.githubusercontent.com/u/64135645" alt="INKODE soc coop"></a>




## Install & development

This project uses the [Yarn Package Manager](https://yarnpkg.com) .

Install dependencies

```shell
yarn install
```

Before launching the application, copy the contents of `.env.example` file to `.env` and edit Environment variables.

Launch application in development mode

```shell
yarn start
```

Open the browser and enter the following URL in the address bar

```
http://localhost:3000
```

## Dependencies

- [React](https://reactjs.org/): entire project is based on React;
- [Redux](https://redux.js.org/): for state management;
- [Redux-Saga](https://redux-saga.js.org/): Side effects manager;
- [Material UI](https://mui.com/material-ui/getting-started/overview/): design system;
- [Leaflet](https://leafletjs.com/): library used for map visualization;
- [ECharts](https://echarts.apache.org/): library used display the timeseries charts.

## Project Structure

- `src/app/index.tsx`: application's entry point;
- `src/app/pages/MapPage/index.tsx`: main container, it's rendered throughout the application;
- `src/app/pages`: Application pages;
- `src/app/components`: React components;
- `src/app/Services/API`: APIs consumers, based on `axios`, to communicate with the server and other services such as Thredds;
- `src/app/utils/theme.ts`: Material UI theme customizations.
- `src/locales/it/translation.json`: Italian terms dictionary;
- `src/app/pages/MapPage/slice`: Redux and Redux-Saga management;
- `src/utils`: Utility functions.

## Docker build command for production

```shell
docker build -t ppcv_frontend -f production.Dockerfile .
```


