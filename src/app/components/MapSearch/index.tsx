import React, { useState, useEffect, useRef } from 'react';
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
import { useSearchParams } from 'react-router-dom';

export interface MapSearchProps {
  className?: string;
  value: iCityItem;
  setPoint?: Function;
  openCharts?: Function;
  defaultCenter: [number, number];
  defaultZoom: number;
  vectorLayer: any;
  customClick?: Function;
}

export interface MapPopupProps {
  className?: string;
  value: iCityItem;
  setPoint?: Function;
  openCharts: Function;
  currentTimeserie: any;
  unit: string;
  precision: number;
  mode?: string;
  data?: string;
  ap?: string;
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
  let {
    value,
    setPoint,
    openCharts,
    className,
    defaultCenter,
    defaultZoom,
    vectorLayer,
    customClick,
  } = props;
  const [cities, setCities] = useState<any>([]);
  const api = RequestApi.getInstance();
  const map = useMap();
  const context = useLeafletContext();
  const { t, i18n } = useTranslation();
  const resetMap = () => context.map.flyTo(defaultCenter, defaultZoom);

  const currCity = useRef<string | null>();

  useEffect(() => {
    api.getCities(setCities);
  }, [setCities]);

  const onChange = (event, value) => {
    let lastCitiess = localStorage.getItem('lastCities');
    if (lastCitiess) {
      let lastCities = JSON.parse(lastCitiess);
      if (lastCities) {
        if (lastCities.find(x => x.label === value.label)) {
          lastCities = lastCities.filter(x => x.label !== value.label);
        }
        lastCities.unshift(value);
      } else {
        lastCities = [value];
      }
      lastCities = lastCities.slice(0, 3);
      localStorage.setItem('lastCities', JSON.stringify(lastCities));
    } else {
      localStorage.setItem('lastCities', JSON.stringify([value]));
    }
    console.log('Ricerca per comune', event, value);
    typeof setPoint === 'function' && setPoint(value);
    if (!value) {
      // console.log('no value')
      resetMap();
    }
    // @ts-ignore
    const found = Object.values(map._layers).find(
      // @ts-ignore
      x => x._url && x._url.includes('municipalities'),
    );
    // @ts-ignore
    if (found && value?.latlng) {
      //if (localStorage.getItem('muni')) {
      //  // @ts-ignore
      //  found.resetFeatureStyle(localStorage.getItem('muni'));
      //}
      //if (localStorage.getItem('muni2')) {
      //  // @ts-ignore
      //  found.resetFeatureStyle(localStorage.getItem('muni2'));
      //}
      //localStorage.setItem('muni2', value.label);
      localStorage.setItem('currentCityLabel', value.label);
      context.map.flyTo(
        [value.latlng.lat, value.latlng.lng],
        context.map.getZoom() - 1,
      );
      // @ts-ignore
      found.setFeatureStyle(value.label, {
        color: '#164d36',
        weight: 2,
        radius: 1,
        fill: true,
        fillOpacity: 0,
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
        label: value.label,
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
    if (latlng.indexOf(' ') > 0) {
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
        } else {
          value = {
            name: '',
            latlng: {
              lat: latf,
              lng: lngf,
            },
          };
        }
      }
    }
  }

  function searchPoint(event) {
    if (value) {
      const position = api
        .findMunicipality(value?.latlng.lat, value?.latlng.lng)
        .then((geoj: any) => {
          if (geoj?.features?.length > 0) {
            if (value) {
              value.name = geoj.features[0].properties.name;
              value.label = geoj.features[0].properties.name;
              onChange(event, value);
            }
          }
        });
      console.log(position);
    }
  }

  // @ts-ignore
  return (
    <Box component="form" className={className} sx={MapSearchContainerStyle}>
      {cities?.length > 0 ? (
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
              <TextField {...params} label="" placeholder={t('app.search')} />
            )}
            onChange={onChange}
            value={value}
            isOptionEqualToValue={(option, value) =>
              option?.label === value?.label
            }
            getOptionLabel={option =>
              option?.name ??
              option?.label ??
              localStorage.getItem('currentCityLabel')
            }
          />
        </Box>
      ) : (
        <></>
      )}

      <Box sx={MapSearchSecondRowStyle}>
        <TextField
          sx={LatLngStyle}
          size={'small'}
          color={'secondary'}
          variant="outlined"
          defaultValue={
            value
              ? roundTo4(value.latlng.lat) + ', ' + roundTo4(value.latlng.lng)
              : ''
          }
          onChange={latlonChange}
          InputProps={{
            endAdornment: (
              <>
                <Tooltip title="cerca">
                  <IconButton edge="end" onClick={searchPoint}>
                    <SearchIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="centra">
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
                </Tooltip>
                <Tooltip title="vista iniziale">
                  <IconButton edge="end" onClick={resetMap}>
                    <RefreshIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                </Tooltip>
              </>
            ),
          }}
          aria-label={'Centra la mappa'}
        ></TextField>
      </Box>
    </Box>
  );
};

export const CompactValueRenderer = ({ time, value, unit, precision }) => {
  const { t, i18n } = useTranslation();
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
        {value !== null
          ? value
            ?.toFixed(precision)
            .replaceAll('.', i18n.language === 'it' ? ',' : '.')
          : '-'}{' '}
        {unit}
      </div>
      <span style={{ flex: '1 1 1px' }}></span>
    </div>
  );
};

export const MapPopup: React.FunctionComponent<MapPopupProps> = props => {
  const {
    value,
    setPoint,
    openCharts,
    className,
    unit,
    precision,
    currentTimeserie,
    mode,
    data,
    ap,
  } = props;
  //const { cities, selected_map } = useSelector((state: any) => state.map);

  const [timeserie, setTimeSerie] = useState<any[]>([]);
  const map = useMap();
  const context = useLeafletContext();
  const { t } = useTranslation();

  let [tt, setTt] = useState(2035);
  let [tv, setTv] = useState(0);
  const [tsIndex, setTsIndex] = useState(0);
  const [otsIndex, setOTsIndex] = useState(0);

  let tsindex = 0;
  const [baseYear, setBaseYear] = useState<number>();

  let yr = data === 'forecast' ? 2035 : new Date().getFullYear() - 1;
  let oyr = 0;
  let otsindex = 0;

  useEffect(() => {
    if (currentTimeserie && currentTimeserie.values) {
      setTimeSerie([...currentTimeserie.values]);
      let fy = parseInt(currentTimeserie.values[0].datetime.split('-')[0]);
      setBaseYear(fy);
    } else {
      setTimeSerie([]);
      setTt(NaN);
      setTv(0);
      setBaseYear(data === 'forecast' ? 1976 : 1984);
    }
  }, [currentTimeserie]);

  useEffect(() => {
    let att = yr;
    let atv = 0;
    let url = new URL(window.location.href);
    let yrparam = url.searchParams.get('year');
    let yrfield = document.getElementsByClassName('timecontrol-date');
    let yrstring =
      data === 'forecast' ? '2035' : (new Date().getFullYear() - 1).toString();
    if (yrfield.length > 0) {
      yrstring = yrfield[0].textContent!;
    } else if (yrparam) {
      yrstring = yrparam;
    }
    try {
      yr = parseInt(yrstring, 10);
      if (isNaN(yr))
        yr = data === 'forecast' ? 2035 : new Date().getFullYear() - 1;
    } catch (ex) {
      yr = data === 'forecast' ? 2035 : new Date().getFullYear() - 1;
    }

    let ctsindex = tsindex;

    if (oyr !== yr) {
      oyr = yr;

      if (timeserie) {
        if (timeserie.length > 0) {
          setBaseYear(parseInt(timeserie[0].datetime.split('-')[0], 10));
          if (timeserie.length > 1) {
            let found_year = timeserie.filter(
              x => x.datetime.split('-')[0] === yr.toString(),
            );
            if (found_year.length > 0) {
              ctsindex = timeserie.indexOf(found_year[0]);

              //@ts-ignore
              map.timeDimension.setCurrentTime(
                new Date(found_year[0].datetime).getTime(),
              );
            } else {
              ctsindex = 0;
            }
            //ctsindex = yr - baseYear;
          } else {
            ctsindex = 0;
          }
          setTsIndex(ctsindex);
        }
      }
    }
  }, [timeserie, baseYear]);

  //@ts-ignore
  map.timeDimension.on('timeloading', data => {
    if (baseYear) {
      let dt = new Date(+data.time).getFullYear();
      console.log(dt);
      setOTsIndex(tsIndex);
      const index = dt - baseYear;
      setTsIndex(index);

      let url = new URL(window.location.href);
      if (url.searchParams.has('year')) {
        url.searchParams.set('year', dt.toString());
      } else {
        url.searchParams.append('year', dt.toString());
      }
      window.history.pushState(null, '', url.toString());
    }
  });

  useEffect(() => {
    let ctt = timeserie[tsIndex]?.datetime;
    let ctv = timeserie[tsIndex]?.value;

    setTt(ctt);
    setTv(ctv);
  }, [tsIndex, timeserie]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {timeserie &&
        (mode !== 'simple' || (mode === 'simple' && ap !== 'annual')) && (
          <CompactValueRenderer
            time={tt}
            value={tv}
            unit={unit}
            precision={precision}
          />
        )}
      <span style={{ flex: '1 1 1px' }}></span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ flex: '1 1 1px' }}></span>
        <Tooltip
          title={
            timeserie?.length === 1
              ? t('app.map.timeSeries.unavailable')
              : t('app.map.timeSeries.available')
          }
          enterTouchDelay={0}
        >
          <span>
            <IconButton
              onClick={() => openCharts(value)}
              aria-label={'Mostra serie temporale'}
              disabled={timeserie?.length <= 1}
            >
              <LineAxisIcon />
            </IconButton>
          </span>
        </Tooltip>
        <span style={{ flex: '1 1 1px' }}></span>
      </div>
      {mode === 'simple' && data !== 'past' && (
        <span style={{ flex: '1 1 1px' }}></span>
      )}
    </div>
  );
};
