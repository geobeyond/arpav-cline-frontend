import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import L from 'leaflet';
import { ScaleControl, useMapEvent } from 'react-leaflet';

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
import { UncertaintySwitch } from './UncertaintySwitch';
import { useTranslation } from 'react-i18next';
import { StationsLayer } from './StationsLayer';

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
  selectedPoint?: iCityItem;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  currentMap?: any;
  currentLayer?: string;
  currentTimeserie?: any;
  setCurrentMap?: Function;
  setCurrentYear?: Function;
}

const Map = (props: MapProps) => {
  const {
    setPoint = () => { },
    openCharts = () => { },
    onReady = () => { },
    selectedPoint = { name: '', latlng: { lat: 0, lng: 0 } },
    defaultCenter = [45.9, 12.45],
    defaultZoom = 8,
    layerConf = {},
    currentMap = {},
    currentLayer = '',
    currentTimeserie = {},
    setCurrentMap = () => { },
    setCurrentYear = () => { },
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));
  const { i18n } = useTranslation();

  const [wmsTimeDimension, setWmsTimeDimension] = React.useState<string>(
    '1976-07-01T00:00:00Z/2099-07-01T23:59:59Z/P1Y',
  );

  const timeDimensionOptions = {
    times: wmsTimeDimension,
    minBufferReady: 0,
  };

  const [click, setClick] = React.useState();

  const vectorWrapperRef = useRef();
  const ref5 = useRef(null);
  const api = new RequestApi();

  const [timeStatus, setTimeStatus] = React.useState('none');

  const [showUncertainty, setShowUncertainty] = React.useState(true);
  const [showUncertaintyControl, setShowUncertaintyControl] =
    React.useState<boolean>();
  const [sensorPositions, setSensorPositions] = React.useState<any>({
    type: 'FeatureCollection',
    features: [],
  });

  const player = useRef();
  const [opacity, doSetOpacity] = React.useState(0.85);

  let maptd = useRef();

  useEffect(() => {
    console.log(layerConf);
    setShowUncertainty(true);
    console.log('getting capabilities for ', currentLayer);

    api.getCapabilities(currentLayer).then((x: string) => {
      let xml = x;
      try {
        let dim = xml.split('Dimension')[1];
        dim = dim.split('>')[1];
        dim = dim.split('<')[0];
        dim = dim.replaceAll('365D', '1Y').replaceAll('360D', '1Y');
        let adim = dim
          .trim()
          .split(',')
          .map(xx => new Date(xx.trim()).getTime());
        if (maptd.current) {
          // @ts-ignore
          maptd.current.timeDimension.setAvailableTimes(adim, 'replace');
        }
        return setWmsTimeDimension(adim.join(','));
      } catch (ex) {
        console.log(ex);
      }
    });
    if (
      layerConf.wms_secondary_layer_name == null ||
      layerConf.wms_secondary_layer_name.length === 0
    ) {
      setShowUncertaintyControl(false);
    } else {
      setShowUncertaintyControl(true);
    }
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
        player: player.current,
      }}
      timeDimensionPlayerOptions={{
        minBufferReady: 0,
      }}
      //@ts-ignore
      whenReady={obj => {
        onReady(obj.target);
        //@ts-ignore
        maptd.current = obj.target;
        //@ts-ignore
        player.current = new L.TimeDimension.Player(
          {
            buffer: 0,
            minBufferReady: 0,
          },
          obj.target.timeDimension,
        ).on('play', () => {
          console.log('play!!');
        });
      }}
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
        {showUncertaintyControl && (
          <Box
            className="leaflet-bar"
            style={{ backgroundColor: 'white', padding: '2px' }}
          >
            <UncertaintySwitch
              enabled={true}
              setShowUncertainty={setShowUncertainty}
              currentUncertainty={showUncertainty}
            ></UncertaintySwitch>
          </Box>
        )}
      </CustomControlMap>
      <CustomControlMap position={'topright'}>
        <Box
          className="leaflet-bar"
          style={{ backgroundColor: 'white', padding: '2px' }}
        >
          <OpacityComponent
            doSetOpacity={doSetOpacity}
            opacity={opacity}
          ></OpacityComponent>
        </Box>
      </CustomControlMap>
      <CustomControlMap position={'topright'}>
        <LegendBar
          className={'leaflet-bar'}
          isMobile={isMobile}
          label={currentMap.climatological_variable}
          data={layerConf.legend}
          unit={
            i18n.language.indexOf('it') >= 0
              ? layerConf.unit_italian
              : layerConf.unit_english
          }
          precision={layerConf.data_precision}
        />
      </CustomControlMap>
      {!isMobile && (
        <MousePositionComponent
          position={'bottomright'}
          customComponent={
            isMobile ? MobileMousePositionDisplay : MousePositionDisplay
          }
        // onClick={onMapClick}
        />
      )}
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
            url="https://tiles.maps.eox.at/wmts?layer=s2cloudless-2021_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}"
            attribution='&copy; <a target="_blank" rel="noopener" href="https://tiles.maps.eox.at/">Sentinel-2 cloudless</a> by EOX'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <StationsLayer zIndex={550}></StationsLayer>
      <VectorWrapperLayer
        zIndex={600}
        ref={vectorWrapperRef}
        selectCallback={point => setPoint(point)}
        selectedPoint={selectedPoint}
        openCharts={openCharts}
        onCustom={click}
        currentTimeserie={currentTimeserie}
        unit={
          i18n.language.indexOf('it') >= 0
            ? layerConf.unit_italian
            : layerConf.unit_english
        }
        precision={layerConf.data_precision}
      />

      <TWLSample
        zIndex={500}
        layer={currentLayer}
        opacity={opacity}
        show={
          showUncertainty
            ? layerConf.wms_main_layer_name
            : layerConf.wms_secondary_layer_name
        }
        stl={layerConf.palette}
        useTime={setTimeStatus}
        isTimeseries={currentMap.aggregation_period === 'annual'}
        setCurrentYear={setCurrentYear}
      />
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
