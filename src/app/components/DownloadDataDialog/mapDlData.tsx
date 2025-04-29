import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { MapState } from '../../pages/MapPage/slice/types';
import {
  Box,
  Typography,
  Slider,
  Skeleton,
  Input as MuiInput,
  TextField,
  Button,
  MenuItem,
  Select,
  Modal,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  MapDataSectionTextStyle,
  MapDataValueTextStyle,
  YearsSliderStyle,
  FieldContainerStyle,
  ImgButtonContainerStyle,
  ImgDoubleButtonContainerStyle,
  MapDataContainerStyle,
  SliderContainerStyle,
  InputYearStyle,
  FieldsStyle,
  RowStyle,
  MapColStyle,
  FullWidthStyle,
} from './styles';
import { DownloadMap } from './DownloadMap';
import { roundTo4 } from '../../../utils/json_manipulations';
import { LatLngBounds } from 'leaflet';

import { RequestApi } from 'app/Services';
//import Select from 'react-select';

export function range(stop: number): number[];
export function range(start: number, stop: number, step?: number): number[];
export function range(
  startOrStop: number,
  stop?: number,
  step: number = 1,
): number[] {
  if (step === 0) {
    throw new RangeError('Parameter step must be different from 0');
  }
  const startBound = stop === undefined ? 0 : startOrStop;
  const stopBound = stop === undefined ? startOrStop : stop;
  return Array.from(
    { length: Math.ceil((stopBound - startBound) / step - 1) + 1 },
    (_, index) => startBound + index * step,
  );
}

export interface MapDlDataProps {
  // getMapImg: Function;
  onChange?: (values: any) => void;
  configuration: any;
  menus: any;
  setActive: Function;
  combinations: any;
  mode?: string;
}

const MapDlData = (props: MapDlDataProps) => {
  const attributes: any = props.menus;
  const combinations: any = props.combinations;
  const onChange = props.onChange ?? (() => { });
  const setActive = props.setActive;
  const configuration = props.configuration;
  const featureGroupRef: any = useRef();
  const { t, i18n } = useTranslation();
  const mode = props.mode ?? 'forecast';

  const api = RequestApi.getInstance();

  const activeConfiguration: any = useRef({
    ...configuration,
  });
  const previousSeason: any = useRef('');

  const [activeCombination, setActiveCombination] = React.useState<any>(
    combinations[configuration.climatological_variable],
  );

  //@ts-ignore
  const { selected_map, forecast_parameters, timeserie } = useSelector(
    state => (state as any)?.map as MapState,
  );

  const mapBounds = [
    [selected_map.bbox[1][1], selected_map.bbox[0][1]],
    [selected_map.bbox[1][0], selected_map.bbox[0][0]],
  ];
  const [downLoadBounds, setDownLoadBounds] = React.useState(mapBounds);
  const [showReset, setShowReset] = React.useState(false);

  const resetBounds = () => {
    setDownLoadBounds(mapBounds);
    featureGroupRef?.current?.clearLayers();
  };

  const changeBounds = bounds => {
    setDownLoadBounds(bounds);
    JSON.stringify(bounds) !== JSON.stringify(mapBounds)
      ? setShowReset(true)
      : setShowReset(false);
  };

  const setBoundsFromMap = (bounds: LatLngBounds) => {
    changeBounds([
      [
        bounds.getSouth().toFixed(3), //south
        bounds.getWest().toFixed(3), //west
      ],
      [
        bounds.getNorth().toFixed(3), // north
        bounds.getEast().toFixed(3), // east
      ],
    ]);
  };

  const times: number[] = range(1976, 2100, 1); // timeserie ? timeserie[0].values.map(v => v.time) : [];

  const [years, setYears] = React.useState<number[]>([0, times.length - 1]);

  const [found, setFound] = React.useState<number>(1);

  const [error, setError] = React.useState<string>('');
  const openError = type => setError(type);
  const closeError = () => setError('');
  // const [netCdf, setNetCdf] = React.useState<any>(null);

  const yearsHandleChange = (event, newValue: number | number[]) => {
    setYears(newValue as number[]);
  };

  const findValueName = (key: string, listKey: string) => {
    const id = selected_map[key];
    let name = '';
    if (id)
      name = forecast_parameters[listKey]?.find(item => item.id === id)?.name;
    return name ?? '';
  };

  const joinNames = (names: string[]) => names.filter(name => name).join(' - ');

  React.useEffect(() => {
    const values = {};
    values['time_start'] = times[years[0]];
    values['time_end'] = times[years[1]];
    onChange(values);
  }, [onChange]);

  React.useEffect(() => {
    const values = {};
    values['north'] = parseFloat(downLoadBounds[1][0]);
    values['south'] = parseFloat(downLoadBounds[0][0]);
    values['east'] = parseFloat(downLoadBounds[1][1]);
    values['west'] = parseFloat(downLoadBounds[0][1]);
    onChange(values);
  }, [downLoadBounds, onChange]);

  const getOptions = field => {
    let x = attributes.filter(x => x.name === field);
    if (x && x.length > 0) {
      return x[0].allowed_values.map(xx => {
        return {
          value: xx.name,
          label:
            i18n.language === 'it'
              ? xx.display_name_italian
              : xx.display_name_english,
        };
      });
    }
    return [];
  };

  const toDefault = object => {
    let ret: any = {};
    for (let k of Object.keys(object)) {
      if (object[k].length > 0) {
        ret[k] = object[k][object[k].length - 1];
      } else {
        ret[k] = null;
      }
    }

    ret.climatological_model = 'model_ensemble';
    ret.scenario = 'rcp85';
    ret.aggregation_period = '30yr';
    ret.measure = 'anomaly';
    ret.time_window = 'tw1';

    return ret;
  };

  const handleChange = (field, value) => {
    previousSeason.current = activeConfiguration.current.year_period;
    if (field === 'climatological_variable') {
      setActiveCombination(combinations[value]);
      const conf = toDefault(combinations[value]);
      activeConfiguration.current = conf;
      setActive(activeConfiguration.current);
    } else {
      const conf = { ...activeConfiguration.current, ...{ [field]: value } };
      activeConfiguration.current = conf;
      setActive(activeConfiguration.current);
    }

    api
      .getLayers(
        activeConfiguration.current.climatological_variable,
        activeConfiguration.current.climatological_model,
        activeConfiguration.current.scenario,
        activeConfiguration.current.measure,
        activeConfiguration.current.time_period,
        activeConfiguration.current.aggregation_period,
        activeConfiguration.current.year_period,
      )
      .then(x => {
        setFound(x.items.length);
        if (x.items.length === 0) {
          openError('wrong_config');
          activeConfiguration.current = {
            ...activeConfiguration.current,
            ...(field === 'climatological_model' && value.length === 0
              ? { climatological_model: ['model_ensemble'] }
              : {
                climatological_model:
                  activeConfiguration.current.climatological_model,
              }),
            ...(field === 'year_period'
              ? {
                year_period: previousSeason.current,
              }
              : {
                year_period: activeConfiguration.current.year_period,
              }),
            ...(field === 'aggregation_period'
              ? {
                measure:
                  activeConfiguration.current.measure === 'absolute'
                    ? 'anomaly'
                    : 'absolute',
              }
              : {}),
            ...(field === 'measure'
              ? {
                measure:
                  activeConfiguration.current.measure === 'absolute'
                    ? 'anomaly'
                    : 'absolute',
              }
              : {}),
          };
          setActive(activeConfiguration.current);
        }
      });
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

  return (
    <Box sx={MapDataContainerStyle}>
      <Box sx={FieldsStyle}>
        <Box sx={RowStyle}>
          {/*Column1*/}
          <Box sx={FieldContainerStyle}>
            <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
              {t('app.map.downloader.indicator')}
            </Typography>
            <FormControl>
              <Select
                sx={FullWidthStyle}
                value={activeConfiguration.current.climatological_variable}
                onChange={e =>
                  handleChange('climatological_variable', e.target.value)
                }
                name="climatological_variable"
              >
                {getOptions('climatological_variable').map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        {mode === 'forecast' ? (
          <Box sx={RowStyle}>
            <Box>
              <Box sx={FieldContainerStyle}>
                <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
                  {t('app.map.downloader.model')}
                </Typography>
                <FormControl>
                  <Select
                    sx={FullWidthStyle}
                    value={
                      typeof activeConfiguration.current
                        .climatological_model === 'object'
                        ? activeConfiguration.current.climatological_model
                        : [activeConfiguration.current.climatological_model]
                    }
                    multiple
                    name="climatological_model"
                    onChange={e =>
                      handleChange('climatological_model', e.target.value)
                    }
                  >
                    {getOptions('climatological_model').map(item => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={FieldContainerStyle}>
                <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
                  {t('app.map.downloader.scenario')}
                </Typography>
                <FormControl>
                  <Select
                    sx={FullWidthStyle}
                    value={
                      typeof activeConfiguration.current.scenario === 'object'
                        ? activeConfiguration.current.scenario
                        : [activeConfiguration.current.scenario]
                    }
                    multiple
                    name="scenario"
                    onChange={e => handleChange('scenario', e.target.value)}
                  >
                    {getOptions('scenario').map(item => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        ) : (
          <></>
        )}

        <Box sx={RowStyle}>
          <Box sx={FieldContainerStyle}>
            <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
              {t('app.map.downloader.average')}
            </Typography>
            <FormControl>
              <Select
                sx={FullWidthStyle}
                value={activeConfiguration.current.aggregation_period}
                onChange={e =>
                  handleChange('aggregation_period', e.target.value)
                }
                name="aggregation_period"
              >
                {getOptions('aggregation_period').map(item => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    disabled={
                      activeCombination.aggregation_period.indexOf(item.value) <
                      0
                    }
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={FieldContainerStyle}>
            <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
              {t('app.map.downloader.measure')}
            </Typography>
            <FormControl>
              <Select
                sx={FullWidthStyle}
                value={activeConfiguration.current.measure}
                onChange={e => handleChange('measure', e.target.value)}
                name="measure"
              >
                {getOptions('measure').map(item => (
                  <MenuItem
                    key={item.value}
                    disabled={activeCombination.measure.indexOf(item.value) < 0}
                    value={item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {mode === 'forecast' ? (
            <Box sx={FieldContainerStyle}>
              <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
                {t('app.map.downloader.quantity')}
              </Typography>
              <FormControl>
                <Select
                  sx={FullWidthStyle}
                  disabled={
                    activeConfiguration.current.aggregation_period !== '30yr'
                  }
                  value={activeConfiguration.current.time_window}
                  onChange={e => handleChange('time_window', e.target.value)}
                  name="time_window"
                >
                  {getOptions('time_window').map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box sx={FieldContainerStyle}>
              <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
                {t('app.map.downloader.quantity')}
              </Typography>
              <FormControl>
                <Select
                  sx={FullWidthStyle}
                  disabled={
                    activeConfiguration.current.aggregation_period !== '30yr'
                  }
                  value={activeConfiguration.current.time_window}
                  onChange={e =>
                    handleChange('reference_period', e.target.value)
                  }
                  name="reference_period"
                >
                  {getOptions('reference_period').map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        <Box sx={RowStyle}>
          <Box sx={FieldContainerStyle}>
            <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
              {t('app.map.downloader.season')}
            </Typography>
            <FormControl>
              <Select
                sx={FullWidthStyle}
                value={activeConfiguration.current.year_period}
                onChange={e => handleChange('year_period', e.target.value)}
                name="year_period"
              >
                {getOptions('year_period').map(item => (
                  <MenuItem
                    key={item.value}
                    disabled={
                      activeCombination.year_period.indexOf(item.value) < 0
                    }
                    value={item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Box sx={MapColStyle}>
        {/*Column2*/}
        <Box sx={FieldContainerStyle}>
          <DownloadMap
            mapBounds={mapBounds}
            downLoadBounds={downLoadBounds}
            featureGroupRef={featureGroupRef}
            setBoundsFromMap={setBoundsFromMap}
            resetBounds={resetBounds}
          />
          <Box sx={RowStyle}>
            <Box sx={ImgButtonContainerStyle}>
              <TextField
                id="outlined-number"
                label={t('app.map.downloadDataDialog.map.west')}
                type="number"
                value={downLoadBounds[0][1]}
                onChange={e => {
                  changeBounds([
                    [
                      downLoadBounds[0][0],
                      Number(e.target.value.replace(',', '.')),
                    ],
                    [downLoadBounds[1][0], downLoadBounds[1][1]],
                  ]);
                }}
                InputProps={{
                  inputProps: {
                    max: mapBounds[1][1],
                    min: mapBounds[0][1],
                    step: 0.001,
                  },
                }}
              />
            </Box>
            <Box sx={ImgDoubleButtonContainerStyle}>
              <TextField
                id="outlined-number"
                label={t('app.map.downloadDataDialog.map.north')}
                type="number"
                value={downLoadBounds[1][0]}
                onChange={e => {
                  changeBounds([
                    [downLoadBounds[0][0], downLoadBounds[0][1]],
                    [
                      Number(e.target.value.replace(',', '.')),
                      downLoadBounds[1][1],
                    ],
                  ]);
                }}
                InputProps={{
                  inputProps: {
                    max: mapBounds[1][0],
                    min: mapBounds[0][0],
                    step: 0.001,
                  },
                }}
              />
              <TextField
                id="outlined-number"
                label={t('app.map.downloadDataDialog.map.south')}
                type="number"
                value={downLoadBounds[0][0]}
                onChange={e => {
                  changeBounds([
                    [
                      Number(e.target.value.replace(',', '.')),
                      downLoadBounds[0][1],
                    ],
                    [downLoadBounds[1][0], downLoadBounds[1][1]],
                  ]);
                }}
                InputProps={{
                  inputProps: {
                    max: mapBounds[1][0],
                    min: mapBounds[0][0],
                    step: 0.001,
                  },
                }}
              />
            </Box>
            <Box sx={ImgButtonContainerStyle}>
              <TextField
                id="outlined-number"
                label={t('app.map.downloadDataDialog.map.east')}
                type="number"
                value={downLoadBounds[1][1]}
                onChange={e => {
                  changeBounds([
                    [downLoadBounds[0][0], downLoadBounds[0][1]],
                    [
                      downLoadBounds[1][0],
                      Number(e.target.value.replace(',', '.')),
                    ],
                  ]);
                }}
                InputProps={{
                  inputProps: {
                    max: mapBounds[1][1],
                    min: mapBounds[0][1],
                    step: 0.001,
                  },
                }}
              />
            </Box>
          </Box>
          {showReset && (
            <Button size={'small'} onClick={resetBounds}>
              Ripristina coordinate originali
            </Button>
          )}
          {/*{JSON.stringify(downLoadBounds)}*/}
        </Box>

        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.downloadDataDialog.map.timeRange')}
          </Typography>
          <Box sx={SliderContainerStyle}>
            <span>{times[0]}</span>
            <Slider
              disabled={
                activeConfiguration.current.aggregation_period === '30yr'
              }
              sx={YearsSliderStyle}
              getAriaValueText={() =>
                t('app.map.downloadDataDialog.map.timeRangeLabel')
              }
              valueLabelDisplay="on"
              step={1}
              min={0}
              max={times.length - 1}
              value={[years[0], years[1]]}
              onChangeCommitted={yearsHandleChange}
              onChange={yearsHandleChange}
              valueLabelFormat={index => times[index]}
              disableSwap
            />
            <span>{times[times.length - 1]}</span>
          </Box>
        </Box>
      </Box>

      <Modal
        sx={{ left: '50%', right: '50%' }}
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
    </Box>
  );
};

export default MapDlData;
