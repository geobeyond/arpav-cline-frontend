/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * MapPage
 *
 */
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  Modal,
  Typography,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MapLoadingContainerStyle, mapStyle, SpinnerStyle } from './styles';
import Map from '../../components/Map';
import MapMenuBar from '../../components/MapMenuBar';
import { LatLng, Map as LMap } from 'leaflet';
import {
  SimpleMapScreenshoter,
  PluginOptions,
} from 'leaflet-simple-map-screenshoter';
//import { find_keys, full_find_keys, useMapSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import TimeSeriesDialog from '../../components/TimeSeriesDialog';
import { useSearchParams } from 'react-router-dom';
//import { selectMap } from './slice/selectors';
//import { Filters, iCityItem } from './slice/types';
import { saveAs } from 'file-saver';
import useCustomSnackbar from '../../../utils/useCustomSnackbar';
import HeaderBar from '../../components/HeaderBar';
import { RequestApi } from 'app/Services';

interface MapPageProps {
  map_mode: string;
  map_data: string;
}

const defaultMap: any = {
  climatological_variable: 'tas',
  climatological_model: 'model_ensemble',
  scenario: 'rcp85',
  measure: 'anomaly',
  time_window: 'tw1',
  aggregation_period: '30yr',
  year_period: 'winter',
  archive: 'forecast',
  data_series: 'no',
};

const defaultMapHistorical: any = {
  climatological_variable: 'tas',
  climatological_model: 'model_ensemble',
  scenario: 'rcp85',
  measure: 'absolute',
  reference_period: '1991_2020',
  aggregation_period: '30yr',
  year_period: 'all_year',
  archive: 'historical',
  data_series: 'no',
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function MapPage(props: MapPageProps) {
  const map_mode = props.map_mode;
  const map_data = props.map_data;
  console.log(map_mode, map_data);
  if (map_data === 'forecast') {
    defaultMap['archive'] = 'forecast';
  } else {
    defaultMap['archive'] = 'historical';
  }

  console.log(map_mode, map_data);
  //const actions = useMapSlice();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { enqueueCSnackbar } = useCustomSnackbar();

  const [inProgress, setInProgress] = React.useState(false); //TODO only for debug?
  const [tSOpen, setTSOpen] = React.useState(false);
  const mapRef = React.useRef<LMap | undefined>(undefined);
  const coordRef = React.useRef<LatLng>(new LatLng(0, 0, 0));
  //const { layers, selected_map, cities, forecast_parameters, error } =
  //  useSelector(selectMap);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState();
  const [combinations, setCombinations] = useState({});
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [mapScreen, setMapScreen] = useState<any>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));
  const api = new RequestApi();

  const [caption, setCaption] = useState('');

  const [currentLayer, setCurrentLayer] = useState('');
  const [currentLayerConfig, setCurrentLayerConfig] = useState({});
  const [currentTimeSerie, setCurrentTimeSerie] = useState({});

  const [error, setError] = useState('');
  const openError = type => setError(type);
  const closeError = () => setError('');

  const [foundLayers, setFoundLayers] = useState(0);

  const [currentYear, setCurrentYear] = useState(2036);
  //const [loading, showLoader] = useState(false);

  const currentInfo = useRef(false);
  const currentHide = useRef<any>();

  api.updateCache();

  const handleMapReady = (map: LMap) => {
    mapRef.current = map;
    const mapScreenPlugin = new SimpleMapScreenshoter(PLUGIN_OPTIONS);
    //@ts-ignore
    mapScreenPlugin.addTo(mapRef.current);
    setMapScreen(mapScreenPlugin);
  };

  const [sp, setSearchParams] = useSearchParams();
  const searchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(searchParams);

  let ncmap = { ...defaultMap, ...params };
  if (map_data === 'history') {
    ncmap = { ...defaultMapHistorical, ...params };
  }
  const [currentMap, setCurrentMap] = useState(
    map_data === 'forecast'
      ? { ...defaultMap, ...params }
      : {
        ...defaultMapHistorical,
        ...params,
      },
  );

  const joinNames = (names: string[]) => names.filter(name => name).join(' - ');

  const labelFor = (itm: string) => {
    const configs = localStorage.getItem('configs');
    const rcps = configs ? JSON.parse(configs) : [];
    try {
      const labelsf = rcps.map((config: any) =>
        config.allowed_values.map(x => [
          x.name,
          i18n.language === 'it'
            ? x.display_name_italian
            : x.display_name_english,
        ]),
      );
      const labels = Object.fromEntries(labelsf.flat());
      return labels[itm];
    } catch (ex) {
      return '';
    }
  };

  const findValueName = (key: string, listKey: string) => {
    //const id = selected_map[key];
    let name = '';
    //if (id)
    //  name = forecast_parameters[listKey]?.find(item => item.id === id)?.name;
    return name ?? '';
  };

  const merge = (...objs) =>
    [...objs].reduce(
      (acc, obj) =>
        Object.keys(obj).reduce((a, k) => {
          acc[k] = acc.hasOwnProperty(k)
            ? [].concat(acc[k]).concat(obj[k])
            : obj[k];
          return acc;
        }, {}),
      {},
    );

  useEffect(() => {
    const all_meas = ['absolute', 'anomaly'];
    const all_pers = ['annual', '30yr'];
    const all_indx = [
      'tas',
      'cdds',
      'hdds',
      'pr',
      'snwdays',
      'su30',
      'tasmax',
      'tasmin',
      'tr',
      'fd',
    ];

    const changeables = ['measure', 'year_period', 'time_window'];
    setCurrentMap({ ...searchParams });
    api.getAttributes(map_data, map_mode).then(x => {
      //@ts-ignore
      setMenus(x.items);
      let combos = x.combinations.reduce((prev, cur) => {
        for (let k of Object.keys(defaultMap)) {
          if (!(k in cur.other_parameters)) {
            cur.other_parameters[k] = [];
            if (k in cur) {
              cur.other_parameters[k].push(cur[k]);
            }
          }
        }
        const kk = cur.climatological_variable + '::' + cur.aggregation_period;
        const km = cur.climatological_variable + '::' + cur.measure;
        const ki = cur.climatological_variable;
        cur.kk = kk;
        cur.ki = ki;
        if (ki in prev) {
          prev[ki].aggregation_period.push(cur.aggregation_period);
          prev[ki].measure.push(cur.measure);
        } else {
          prev[ki] = { ...cur.other_parameters };
          prev[ki].aggregation_period = [cur.aggregation_period];
          prev[ki].measure = [cur.measure];
        }
        if (kk in prev) {
          prev[kk][cur.measure] = cur.other_parameters;
        } else {
          prev = {
            ...prev,
            [cur.climatological_variable + '::' + cur.aggregation_period]: {
              [cur.measure]: cur.other_parameters,
            },
          };
        }
        if (km in prev) {
          prev[kk][cur.aggregation_period] = cur.other_parameters;
        } else {
          prev = {
            ...prev,
            [cur.climatological_variable + '::' + cur.measure]: {
              [cur.aggregation_period]: cur.other_parameters,
            },
          };
        }
        return prev;
      }, {});
      // TODO: copiare configurazione year_period dell'indicatore su tutte le altre combo;
      for (let k of Object.keys(combos)) {
        if (k.indexOf('::') >= 0) {
          const m = k.split('::')[0];
          let nc: any = {};
          let kks = Object.keys(combos[k]);
          if (kks.length === 1) {
            combos[k] = combos[k][kks[0]];
          } else {
            for (let kk of kks) {
              nc = merge(nc, combos[k][kk]);
            }
            combos[k] = nc;
          }
          if (all_indx.indexOf(m) >= 0) {
            combos[k].measure = all_meas;
            combos[k].aggregation_period = all_pers;
          }
          combos[k].climatological_variable = [m];
        } else {
          if (all_indx.indexOf(k) >= 0) {
            combos[k].measure = all_meas;
            combos[k].aggregation_period = all_pers;
          }
          combos[k].climatological_variable = [k];
        }
      }
      setCombinations(combos);
    });
    setCurrentMap({ ...searchParams });
    if (searchParams.get('plotPopup')) {
      setTSOpen(true);
    }

    //if(searchParams.get('lat') && searchParams.get('lng')){
    //  setTimeout(()=>{
    //    setSelectedPoint({latlng:{lat: searchParams.get('lat'), lng: searchParams.get('lng')}})
    //  }, 500);
    //}
  }, []);

  useEffect(() => {
    const all_meas = ['absolute', 'anomaly'];
    const all_pers = ['annual', '30yr'];
    const all_indx = [
      'tas',
      'cdds',
      'hdds',
      'pr',
      'snwdays',
      'su30',
      'tasmax',
      'tasmin',
      'tr',
      'fd',
    ];

    const changeables = ['measure', 'year_period', 'time_window'];

    //setSearchParams(currentMap);

    setSearchParams(currentMap);

    console.log('currentMap', currentMap);

    try {
      if (map_data === 'forecast') {
        api
          .getLayer(
            currentMap.climatological_variable,
            currentMap.climatological_model,
            currentMap.scenario,
            currentMap.measure,
            currentMap.time_window,
            currentMap.aggregation_period,
            currentMap.year_period,
          )
          .then((x: any) => {
            console.log(x);
            setCurrentMap(currentMap);
            setFoundLayers(x.items.length);
            if (x.items.length === 1) {
              api.getLayerConf(x.items[0]).then(conf => {
                setCurrentLayer(x.items[0].identifier);
                setCurrentLayerConfig(conf);
                setLoading(false);
              });
            } else {
            }
          });
      } else {
        api
          .getHistoricLayer(
            currentMap.climatological_variable,
            currentMap.measure,
            currentMap.reference_period,
            currentMap.aggregation_period,
            currentMap.year_period,
          )
          .then((x: any) => {
            console.log(x);
            setCurrentMap(currentMap);
            setFoundLayers(x.items.length);
            if (x.items.length === 1) {
              api.getLayerConf(x.items[0]).then(conf => {
                setCurrentLayer(x.items[0].identifier);
                setCurrentLayerConfig(conf);
                setLoading(false);
              });
            } else {
            }
          });
      }
    } catch (e) {
      console.log(e);
    }

    if ('lat' in currentMap) {
      setTimeout(() => {
        // @ts-ignore
        const found: any = Object.values(mapRef.current?._layers).find(
          // @ts-ignore
          x => x._url && x._url.includes('municipalities'),
        );
        api
          .findMunicipality(currentMap.lat, currentMap.lng)
          .then((geoj: any) => {
            setSelectedPoint({
              name: geoj.features[0].properties.name,
              value: geoj.features[0].properties.name,
              latlng: {
                lat: parseFloat(currentMap.lat),
                lng: parseFloat(currentMap.lng),
              },
            });
            found.setFeatureStyle(geoj.features[0].properties.name, {
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
              latlng: L.latLng([
                parseFloat(currentMap.lat),
                parseFloat(currentMap.lng),
              ]),
              // latlng: found.latlng,
              layer: {
                properties: geoj.features[0].properties,
              },
              label: geoj.features[0].properties.name,
            });
          });
      }, 250);
    }

    //@ts-ignore
    mapRef.current.on(
      'simpleMapScreenshoter.takeScreen',
      () => {
        //currentInfo.current = document
        //  .getElementsByClassName('leaflet-time-info')[0]
        //  //@ts-ignore
        //  .checkVisibility();
        //currentHide.current = setInterval(() => {
        //  document
        //    //@ts-ignore
        //    .getElementsByClassName('leaflet-time-info')[0].style.display =
        //    'none';
        //});
      },
      250,
    );
    //@ts-ignore
    mapRef.current.on('simpleMapScreenshoter.done', () => {
      //clearInterval(currentHide.current);
      //document
      //  //@ts-ignore
      //  .getElementsByClassName('leaflet-time-info')[0].style.display =
      //  currentInfo.current ? 'flex' : 'none';
    });
  }, [currentMap]);

  function paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) {
      // each 'entry' is a [key, value] tuple
      result[key] = value;
    }
    return result;
  }

  useEffect(() => {
    if (currentLayer.length > 0 && selectedPoint) {
      setSearchParams({
        ...paramsToObject(sp),
        ...{ lat: selectedPoint.latlng.lat, lng: selectedPoint.latlng.lng },
      });

      api
        .getTimeserieV2(
          currentLayer,
          selectedPoint.latlng.lat,
          selectedPoint.latlng.lng,
          false,
          false,
          false,
          false,
        )
        .then(data => {
          setCurrentTimeSerie(data.series[0]);
        });
    }
  }, [selectedPoint, currentLayer]);

  useEffect(() => {
    let year = '';
    try {
      year =
        currentMap.aggregation_period === 'annual' ||
          currentMap.aggregation_period === 'test'
          ? new Date((mapRef.current as any).timeDimension?.getCurrentTime())
            .getFullYear()
            .toString()
          : '';
      console.log('showing year', year);
    } catch (e) {
      // console.log('no year');
    }
    const lcaption = `${isMobile
        ? currentMap.climatological_variable
        : labelFor(currentMap.climatological_variable)
      }
  - ${joinNames([
        labelFor(currentMap.climatological_model),
        labelFor(currentMap.scenario),
      ])}
  - ${joinNames([
        labelFor(currentMap.aggregation_period),
        labelFor(currentMap.measure),
      ])}
    ${currentMap.time_window && currentMap.aggregation_period === '30yr'
        ? labelFor(currentMap.time_window)
        : ''
      }
  - ${labelFor(currentMap.year_period)}
  ${currentMap.aggregation_period != '30yr' && currentYear
        ? ` - Anno ${year}`
        : ''
      } `; // string or function, added caption to bottom of screen

    setCaption(lcaption);
  }, [currentMap]);

  const PLUGIN_OPTIONS: PluginOptions = {
    cropImageByInnerWH: true, // crop blank opacity from image borders
    hidden: true, // hide screen icon
    domtoimageOptions: {
      cacheBust: true,
    }, // see options for dom-to-image
    position: 'topleft', // position of take screen icon
    screenName: `${findValueName('variable', 'variables')}`, // string or function
    // iconUrl: ICON_SVG_BASE64, // screen btn icon base64 or url
    hideElementsWithSelectors: [
      // '.leaflet-control-legend',
      '.leaflet-control',
      '.leaflet-control-search',
      '.leaflet-control-zoom',
      '.leaflet-control-coordinates',
      '.leaflet-bar-timecontrol',
      '.leaflet-control-layers',
    ], // by default hide map controls All els must be child of _map._container
    mimeType: 'image/jpeg', // used if format == image,
    caption: `${findValueName('variable', 'variables')}
- ${joinNames([
      findValueName('forecast_model', 'forecast_models'),
      findValueName('scenario', 'scenarios'),
    ])}
- ${joinNames([
      findValueName('data_series', 'data_series'),
      findValueName('value_type', 'value_types'),
      findValueName('time_window', 'time_windows'),
    ])}
- ${findValueName('year_period', 'year_periods')}
      `, // streeng or function, added caption to bottom of screen
    captionFontSize: 15,
    captionFont: 'Arial',
    captionColor: theme.palette.success.contrastText,
    captionBgColor: theme.palette.success.dark,
    captionOffset: 5,
  };

  const updateCurrentMap = status => {
    setLoading(status);
    //let cm = { ...currentMap };
    //cm[key] = value;
    //setCurrentMap(cm);
  };

  const handleDownloadMapImg = () => {
    const format = 'image';
    let year = '';
    try {
      year =
        currentMap.aggregation_period === 'annual' ||
          currentMap.aggregation_period === 'test'
          ? new Date((mapRef.current as any).timeDimension?.getCurrentTime())
            .getFullYear()
            .toString()
          : '';
      console.log('showing year', year);
    } catch (e) {
      // console.log('no year');
    }

    setInProgress(true);

    let filename = `Screenshot ${labelFor(
      currentMap.climatological_variable,
    )} - ${joinNames([
      labelFor(currentMap.climatological_model),
      labelFor(currentMap.scenario),
    ])} - ${joinNames([
      labelFor(currentMap.aggregation_period),
      labelFor(currentMap.measure),
    ])} ${currentMap.time_window && currentMap.aggregation_period === '30yr'
        ? ' - ' + labelFor(currentMap.time_window)
        : ''
      } - ${labelFor(currentMap.year_period)} ${currentMap.aggregation_period != '30yr' && currentYear
        ? ` - Anno ${year}`
        : ''
      }.${
      //@ts-ignore
      navigator?.userAgentData?.platform.toLowerCase().indexOf('linux') >= 0
        ? 'png'
        : 'png'
      }`;
    filename = filename.replaceAll('_', '');

    api.downloadScreenshot(window.location.href, filename).then(() => {
      setInProgress(false);
    });
    //mapScreen
    //  .takeScreen(format, {
    //    captionFontSize: isMobile ? 10 : 12,
    //    screenName: `${currentMap.climatological_variable}`,
    //    caption: caption,
    //  })
    //  .then(blob => {
    //    setInProgress(false);
    //    saveAs(blob as Blob, filename);
    //  })
    //  .catch(e => {
    //    setInProgress(false);
    //    console.error(e);
    //  });
  };

  const openCharts = (latLng: LatLng) => {
    coordRef.current = latLng;

    const sp = new URLSearchParams(window.location.search);
    setSearchParams({
      ...paramsToObject(sp),
      ...{ plotPopup: 'true' },
    });

    setTSOpen(true);
  };

  const setPoint = (props: any) => {
    // console.log('==================== setPoint ====================');
    // console.log(props);
    setSelectedPoint(props);
    // console.log('setPoint', props);
  };

  return (
    <Box sx={mapStyle}>
      <Modal
        open={error.length > 0}
        onClose={closeError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t(error + '.title')}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {t(error + '.message')}
          </Typography>
          <Button onClick={closeError}>Ok</Button>
        </Box>
      </Modal>
      {currentMap.op !== 'screenshot' ? <HeaderBar /> : <></>}
      {currentMap.op !== 'screenshot' ? (
        <MapMenuBar
          onDownloadMapImg={handleDownloadMapImg}
          mode={map_mode}
          data={map_data}
          menus={menus}
          combinations={combinations}
          onMenuChange={updateCurrentMap}
          current_map={currentMap}
          foundLayers={foundLayers}
          setCurrentMap={setCurrentMap}
          openError={openError}
          inProgress={inProgress}
        />
      ) : (
        <></>
      )}

      <Map
        onReady={handleMapReady}
        openCharts={openCharts}
        setPoint={setPoint}
        selectedPoint={selectedPoint}
        layerConf={currentLayerConfig}
        currentLayer={currentLayer}
        currentMap={currentMap}
        currentTimeserie={currentTimeSerie}
        setCurrentMap={setCurrentMap}
        setCurrentYear={setCurrentYear}
        mode={map_mode}
        data={map_data}
      />

      <TimeSeriesDialog
        mode={map_mode}
        map_data={map_data}
        selectedPoint={selectedPoint}
        open={tSOpen}
        setOpen={setTSOpen}
        currentLayer={currentLayerConfig}
        currentMap={currentMap}
      />

      {currentMap.op !== 'screenshot' ? (
        <></>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            backgroundColor: 'rgb(22, 77, 54)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Typography style={{ paddingLeft: '5px' }}>{caption}</Typography>
            <span style={{ flex: '1 1 1px' }}></span>
            <Typography style={{ paddingRight: '5px' }}>
              © ARPAV - ARPA FVG
            </Typography>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Typography
              style={{
                fontSize: 'smaller',
                paddingLeft: '5px',
                paddingRight: '5px',
                display: 'block',
              }}
            >
              Si tratta di proiezioni climatiche e non di previsioni a lungo
              termine. Il valore annuale ha validità in un contesto di trend
              trentennale.
            </Typography>
          </div>
        </div>
      )}

      {/*TODO Backdrop only for debug?*/}
      <Modal open={loading} sx={SpinnerStyle}>
        <CircularProgress color="inherit" size={80} />
      </Modal>
    </Box>
  );
}
