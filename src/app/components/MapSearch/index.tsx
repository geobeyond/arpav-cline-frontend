import React, { useState, useEffect } from 'react';
import {
  Button,
  Paper,
  Autocomplete,
  Box,
  TextField,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import { useSelector } from 'react-redux';
import { useMap, useMapEvent } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { useTranslation } from 'react-i18next';
import { roundTo4 } from '../../../utils/json_manipulations';
import { iCityItem } from '../../pages/MapPage/slice/types';
import {
  AutocompleteSyle,
  LatLngStyle,
  MapSearchContainerStyle,
  MapSearchFirstRowStyle,
  MapSearchSecondRowStyle,
} from './styles';
import { formatYear } from '../../../utils/dates';
import { VectorWrapperLayer } from '../Map/VectorWrapperLayer';
import TodayIcon from '@mui/icons-material/Today';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import { OpacityComponent } from '../Map/OpacityComponent';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { RestartAlt } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { RequestApi } from '../../Services';

export interface MapSearchProps {
  className?: string;
  value: iCityItem | null;
  setPoint?: Function;
  openCharts?: Function;
  defaultCenter: [number, number];
  defaultZoom: number;
  vectorLayer: any;
  customClick?: Function;
}

export interface MapPopupProps {
  className?: string;
  value: iCityItem | null;
  setPoint?: Function;
  openCharts: Function;
  currentTimeseries: any;
  unit: string;
}

export const ValueRenderer = ({ time, value, unit }) => {
  // console.log({timeserie});
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ flex: '1 1 1px' }}></span>
      <Typography variant={'body2'}>
        {/*<div style={{backgroundColor: 'red', color: 'white', padding: 3}}>*/}
        <TodayIcon fontSize={'small'} /> {formatYear(time)}
      </Typography>
      {/*</div>*/}
      <Typography variant={'body2'}>
        <GpsFixedOutlinedIcon fontSize={'small'} />{' '}
        {value !== null ? roundTo4(value, 1) : '-'}
        {unit}
      </Typography>
      <span style={{ flex: '1 1 1px' }}></span>
    </div>
  );
};

export const MapSearch: React.FunctionComponent<MapSearchProps> = props => {
  const {
    value,
    setPoint,
    openCharts,
    className,
    defaultCenter,
    defaultZoom,
    vectorLayer,
    customClick,
  } = props;
  const { cities, selected_map, timeserie } = useSelector(
    (state: any) => state.map,
  );
  const api = RequestApi.getInstance();
  const map = useMap();
  const context = useLeafletContext();
  const { t } = useTranslation();
  const resetMap = () => context.map.flyTo(defaultCenter, defaultZoom);
  const onChange = (event, value) => {
    console.log('Ricerca per comune', event, value);
    typeof setPoint === 'function' && setPoint(value);
    if (!value) {
      // console.log('no value')
      resetMap();
    }
    // @ts-ignore
    const found = Object.values(map._layers).find(
      // @ts-ignore
      x => x._url && x._url.includes('public.places_cities.geometry'),
    );
    // @ts-ignore
    if (found && value?.latlng) {
      context.map.flyTo(
        [value.latlng.lat, value.latlng.lng],
        context.map.getZoom() - 1,
      );
      // @ts-ignore
      found.setFeatureStyle(value.name, {
        color: 'yellow',
        weight: 1,
        radius: 1,
        fill: true,
        fillOpacity: 1,
        opacity: 1,
      });
      // @ts-ignore
      found.fire('click', {
        // @ts-ignore
        latlng: L.latLng([value.latlng.lat, value.latlng.lng]),
        // latlng: found.latlng,
        layer: {
          properties: value,
        },
      });
      setTimeout(() => {
        context.map.flyTo(
          [value.latlng.lat, value.latlng.lng],
          context.map.getZoom() + 1,
        );
      }, 100);
      setTimeout(() => {
        // @ts-ignore
        customClick({
          // @ts-ignore
          latlng: L.latLng([value.latlng.lat, value.latlng.lng]),
          // latlng: found.latlng,
          layer: {
            properties: value,
          },
        });
      }, 100);
    }
  };

  function latlonChange(event) {
    let latlng = event.target.value;
    let lat = latlng.split(' ')[0].replace(',', '.');
    let lng = latlng.split(' ')[1].replace(',', '.');
    let latf = parseFloat(lat);
    let lngf = parseFloat(lng);
    //TODO: check bounding box
    if (
      lngf > 9.018533 &&
      latf > 44.596056 &&
      lngf < 14.576226 &&
      latf < 47.299456
    ) {
      if (value) {
        value.latlng.lat = latf;
        value.latlng.lng = lngf;
      }
    }
  }

  function searchPoint(event) {
    const position = api
      .findMunicipality(value?.latlng.lat, value?.latlng.lng)
      .then((geoj: any) => {
        if (geoj.features.length > 0) {
          if (value) {
            value.name = geoj.features[0].properties.name;
            value.label = geoj.features[0].properties.name;
            onChange(event, value);
          }
        }
      });
    console.log(position);
  }

  // @ts-ignore
  return (
    <Box component="form" className={className} sx={MapSearchContainerStyle}>
      <Box sx={MapSearchFirstRowStyle}>
        <Autocomplete
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          size={'small'}
          // disablePortal
          options={cities}
          sx={AutocompleteSyle}
          renderInput={params => (
            <TextField {...params} label="" placeholder="Ricerca per comune" />
          )}
          onChange={onChange}
          value={value}
          isOptionEqualToValue={(option, value) => option.label === value.label}
        />
      </Box>
      <Box sx={MapSearchSecondRowStyle}>
        {value?.latlng && (
          <TextField
            sx={LatLngStyle}
            size={'small'}
            color={'secondary'}
            variant="outlined"
            defaultValue={
              roundTo4(value.latlng.lat) + ', ' + roundTo4(value.latlng.lng)
            }
            onChange={latlonChange}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton edge="end" onClick={searchPoint}>
                    <SearchIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() =>
                      context.map.flyTo(
                        [value.latlng.lat, value.latlng.lng],
                        context.map.getZoom(),
                      )
                    }
                  >
                    <ZoomInMapIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                  <IconButton edge="end" onClick={resetMap}>
                    <RefreshIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                </>
              ),
            }}
            aria-label={'Centra la mappa'}
          ></TextField>
        )}
      </Box>
    </Box>
  );
};

export const CompactValueRenderer = ({ time, value, unit }) => {
  // console.log({timeserie});
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ flex: '1 1 1px' }}></span>
      <div style={{ padding: '0', margin: 0 }}>
        {/*<div style={{backgroundColor: 'red', color: 'white', padding: 3}}>*/}
        <TodayIcon fontSize={'small'} /> {formatYear(time)}
      </div>
      {/*</div>*/}
      <div style={{ padding: '0', margin: 0 }}>
        <GpsFixedOutlinedIcon fontSize={'small'} />{' '}
        {value !== null ? roundTo4(value, 1) : '-'}
        {unit}
      </div>
      <span style={{ flex: '1 1 1px' }}></span>
    </div>
  );
};

export const MapPopup: React.FunctionComponent<MapPopupProps> = props => {
  const { value, setPoint, openCharts, className, unit, currentTimeseries } =
    props;
  const { cities, selected_map } = useSelector((state: any) => state.map);

  const timeserie = currentTimeseries.values;
  const map = useMap();
  const context = useLeafletContext();
  const { t } = useTranslation();

  let [tt, setTt] = useState(2024);
  let [tv, setTv] = useState(0);

  let tsindex = 0;
  const baseYear = 1976;

  let yr = 2024;
  let oyr = 0;
  let otsindex = 0;

  useEffect(() => {
    let att = yr;
    let atv = 0;
    let yrfield = document.getElementsByClassName('timecontrol-date');
    let yrstring = '2024';
    if (yrfield.length > 0) {
      yrstring = yrfield[0].textContent!;
    }
    try {
      yr = parseInt(yrstring, 10);
    } catch (ex) {
      yr = 2024;
    }

    if (oyr !== yr) {
      oyr = yr;

      if (timeserie) {
        if (timeserie.length > 0) {
          if (timeserie[0].values.length > 1) {
            tsindex = yr - baseYear;
          } else {
            tsindex = 0;
          }
          att = timeserie[tsindex]?.datetime;
          atv = timeserie[tsindex]?.value;
        }
      }

      setTt(att);
      setTv(atv);
    }
  });

  useEffect(() => {
    // @ts-ignore
    map.timeDimension.on('timeloading', data => {
      let dt = new Date(+data.time).getFullYear();
      console.log(dt);
      otsindex = tsindex;
      tsindex = dt - baseYear;
      if (otsindex != tsindex) {
        let ctt = timeserie[tsindex]?.datetime;
        let ctv = timeserie[tsindex]?.value;

        setTt(ctt);
        setTv(ctv);
      }
    });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {timeserie && <CompactValueRenderer time={tt} value={tv} unit={unit} />}
      <span style={{ flex: '1 1 1px' }}></span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ flex: '1 1 1px' }}></span>
        <IconButton
          onClick={() => openCharts(value)}
          aria-label={'Mostra serie temporale'}
        >
          <LineAxisIcon />
        </IconButton>
        <span style={{ flex: '1 1 1px' }}></span>
      </div>
    </div>
  );
};
