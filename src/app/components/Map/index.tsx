import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import sensorPositions from './data';
import L from 'leaflet';
import { ScaleControl } from 'react-leaflet';

import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
  LayersControl,
  Circle,
  CircleMarker,
  Popup,
  GeoJSON,
  useMap,
} from 'react-leaflet';
import { Map as LMap } from 'leaflet';
import {
  MousePositionComponent,
  MousePositionComponentProps,
  MousePositionControlProps,
} from '../MousePosition';
import { MapSearch } from '../MapSearch';
import { DummyControlComponent } from '../DummyMapControl';
import { useSelector } from 'react-redux';
import { ThreddsWrapperLayer } from './ThreddsWrapperLayer';
import CustomControlMap from './CustomControlMap';
import { LegendBar } from './LegendBar';
import { VectorWrapperLayer } from './VectorWrapperLayer';
import { roundTo4 } from '../../../utils/json_manipulations';
import { iCityItem } from '../../pages/MapPage/slice/types';
import {
  MapContainerStyle,
  MobileSpaceDisplayStyle,
  MousePositionDisplayStyle,
} from './styles';
import { OpacityComponent } from './OpacityComponent';
import { Tooltip, UncontrolledTooltip, Button } from 'design-react-kit';
import InfoIcon from '@mui/icons-material/Info';
import { TWLSample } from './TWLSample';
import { RequestApi } from 'app/Services';

// import {BaseLayerControl} from "./BaseLayerControl";

const MobileSpaceDisplay = () => {
  return (
    <div
      className={'custom-panel leaflet-bar leaflet-control'}
      style={MobileSpaceDisplayStyle}
    // style={{visibility: 'hidden'}}
    ></div>
  );
};

const MousePositionDisplay = (props: MousePositionControlProps) => {
  //{props.latlng.lat}
  //{props.latlng.lng}
  return (
    <Box
      className={
        'custom-panel leaflet-bar leaflet-control leaflet-control-coordinates'
      }
      sx={MousePositionDisplayStyle}
    >
      <div>
        {`Lat 
      ${roundTo4(props.latlng.lat)}`}
        <span style={{ visibility: 'hidden' }}>__</span>
        {`Long 
      ${roundTo4(props.latlng.lng)}`}
      </div>
    </Box>
  );
};

const MobileMousePositionDisplay = (props: MousePositionControlProps) => {
  return <></>;
};

interface MapProps {
  onReady?: (map: LMap) => void;
  openCharts?: (iCityItem) => void;
  setPoint?: Function;
  layerConf?: any;
  selectedPoint?: iCityItem | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  currentMap?: any;
  currentLayer?: string;
}

const Map = (props: MapProps) => {
  const {
    setPoint = () => { },
    openCharts = () => { },
    onReady = () => { },
    selectedPoint = null,
    defaultCenter = [45.9, 12.45],
    defaultZoom = 8,
    layerConf = {},
    currentMap = {},
    currentLayer = '',
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const timeDimensionOptions = {
    // requestTimeFromCapabilities: true,
    // updateTimeDimension: true,
  };

  const [click, setClick] = React.useState();

  const vectorWrapperRef = useRef();
  const ref5 = useRef(null);
  const api = new RequestApi();

  const [timeStatus, setTimeStatus] = React.useState('none');

  useEffect(() => {
    console.log(layerConf);
  }, [layerConf, currentLayer]);

  return (
    <MapContainer
      style={MapContainerStyle}
      className="main-map"
      // @ts-ignore
      center={defaultCenter}
      zoom={defaultZoom}
      maxZoom={19}
      zoomControl={false}
      // @ts-ignore
      timeDimensionControl={true}
      timeDimensionextendedControl={true}
      timeDimension={true}
      timeDimensionOptions={timeDimensionOptions}
      timeDimensionControlOptions={{
        speedSlider: false,
        backwardButton: true,
        forwardButton: true,
        playButton: false,
      }}
      //@ts-ignore
      whenReady={obj => onReady(obj.target)}
    >
      <ScaleControl imperial={false} />

      <ZoomControl position={'topright'} />
      {isMobile && (
        <DummyControlComponent
          position={'topright'}
          customComponent={MobileSpaceDisplay}
        />
      )}
      <CustomControlMap position={'topright'}>
        <Box
          className="leaflet-bar"
          style={{ backgroundColor: 'white', padding: '2px' }}
        >
          <OpacityComponent></OpacityComponent>
        </Box>
        <LegendBar
          className={'leaflet-control-legend leaflet-control leaflet-bar'}
          isMobile={isMobile}
        />
      </CustomControlMap>
      <MousePositionComponent
        position={'bottomright'}
        customComponent={
          isMobile ? MobileMousePositionDisplay : MousePositionDisplay
        }
      // onClick={onMapClick}
      />
      <CustomControlMap position={'topleft'}>
        <MapSearch
          className={'leaflet-control-search'}
          value={selectedPoint}
          setPoint={setPoint}
          openCharts={openCharts}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          vectorLayer={vectorWrapperRef}
          customClick={setClick}
        />
      </CustomControlMap>
      {/*<BaseLayerControl/>*/}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a target="_blank" rel="noopener" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Sentinel 2">
          <TileLayer
            url="https://s2maps-tiles.eu/wmts?layer=s2cloudless-2021_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}"
            attribution='&copy; <a target="_blank" rel="noopener" href="https://s2maps.eu/">Sentinel-2 cloudless</a> by EOX'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="Limiti Comunali">
          <VectorWrapperLayer
            ref={vectorWrapperRef}
            selectCallback={point => setPoint(point)}
            selectedPoint={selectedPoint}
            openCharts={openCharts}
            onCustom={click}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Sensori">
          <GeoJSON
            data={sensorPositions}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 2,
                weight: 2,
              });
            }}
            interactive={false}
            onEachFeature={(feature: any, layer: any) => {
              layer.options.interactive = false;
            }}
          ></GeoJSON>
        </LayersControl.Overlay>
        {Object.keys(layerConf).length > 0 && (
          <>
            <LayersControl.Overlay name={layerConf.display_name_italian}>
              <TWLSample
                layer={currentLayer}
                show={layerConf.wms_secondary_layer_name}
                stl={layerConf.palette}
                useTime="setTimestatus"
                useUncertainty={false}
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay
              name={layerConf.display_name_italian + '(con incertezza)'}
            >
              <TWLSample
                layer={currentLayer}
                show={layerConf.wms_main_layer_name}
                stl={layerConf.palette}
                useTime="setTimestatus"
                useUncertainty={true}
              />
            </LayersControl.Overlay>
          </>
        )}
      </LayersControl>

      <CustomControlMap
        position="bottomleft"
        className=" leaflet-time-info"
        style={{
          position: 'absolute',
          margin: 0,
          backgroundColor: 'transparent',
          height: '20px',
          width: '20px',
          bottom: '61px',
          left: '385px',
          display: timeStatus,
          padding: 0,
        }}
      >
        <Button innerRef={ref5} className="m-3">
          <InfoIcon></InfoIcon>
        </Button>
        <UncontrolledTooltip placement="top" target={ref5}>
          Si tratta di proiezioni climatiche e non di previsioni a lungo
          termine. Il valore annuale ha validità in un contesto di trend
          trentennale.
        </UncontrolledTooltip>
      </CustomControlMap>
    </MapContainer>
  );
};

export default Map;
