import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import { Papa } from 'papaparse';
import {
  Box,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Switch,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Radio,
  useMediaQuery,
  TextField,
} from '@mui/material';
import Slider from '@mui/material/Slider';

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { LatLng } from 'leaflet';
import {
  TSDataContainerStyle,
  FieldContainerStyle,
  RowContainerStyle,
  ChartContainerStyle,
  ChartLoaderContainerStyle,
} from './styles';
import { selectMap } from '../../pages/MapPage/slice/selectors';
import {
  caculateMovingAverage,
  getItemByFilters,
  roundTo4,
} from '../../../utils/json_manipulations';
import { full_find_keys, useMapSlice } from '../../pages/MapPage/slice';
import { RequestApi } from '../../Services';
import { formatYear } from '../../../utils/dates';
import { lightBlue } from '@mui/material/colors';
// import { saveAs } from 'file-saver';

export interface TSDataContainerProps {
  latLng: LatLng | any;
  place?: string | null;
  setIds: Function;
  setTimeRange: Function;
  setToDownload: Function;
  setFilters: Function;
}

//TODO
// findValueName duplicated from src/app/components/DownloadDataDialog/mapDlData.tsx: put in utils ?
//    findValueName is similar to the one used in MapBar ?
// Use i18 for fields;

const TSDataContainer = (props: TSDataContainerProps) => {
  const {
    latLng,
    setIds,
    setTimeRange,
    place = '',
    setToDownload = () => {},
    setFilters = (
      mainModel,
      secondaryModel,
      tsSmoothing,
      sensorSmoothing,
      uncertainty,
    ) => {},
  } = props;
  const api = RequestApi.getInstance();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));
  const [movingAvg, setMovingAvg] = useState(true);
  const chartRef = React.useRef<any>(null);

  const dispatch = useDispatch();
  const actions = useMapSlice();

  const findValueName = (key: string, listKey: string) => {
    const id = selected_map[key];
    let name = '';
    if (id)
      name = forecast_parameters[listKey]?.find(item => item.id === id)?.name;
    return name ?? '';
  };

  const findParamName = (key: string, listKey: string) => {
    return (
      forecast_parameters[listKey]?.find(item => item.id === key)?.name || ''
    );
  };
  const baseValue: number = 1976;

  const {
    selected_map,
    layers,
    forecast_parameters,
    selectactable_parameters,
    timeserie,
  } = useSelector(selectMap);
  const { scenarios, forecast_models } = selectactable_parameters;
  const [models, setModel] = React.useState<string[]>([
    selected_map.forecast_model,
    selected_map.forecast_model.includes('ens')
      ? null
      : forecast_models.find(x => x.includes('ens')),
  ]);
  const [timeseries, setTimeseries] = useState<any>([]);
  const joinNames = (names: string[]) => names.filter(name => name).join(' - ');
  const colors = [
    {
      histo: 'rgb(69,50,27)',
      rcp26: 'rgb(46,105,193)',
      rcp45: 'rgb(243, 156, 18)',
      rcp85: 'rgb(231,60,60)',
    },
    {
      histo: 'rgb(82, 73, 62)',
      rcp26: 'rgb(146, 166, 196)',
      rcp45: 'rgb(250, 226, 187)',
      rcp85: 'rgb(232, 169, 169)',
    },
  ];

  const gbase = ['RCP2.6', 'RCP4.5', 'RCP8.5'];

  const gmodels = [
    { label: '--', value: 'ens5' },
    { label: 'EC-EARTH_CCLM4-8-17', value: 'ec_earth_cclm_4_8_17' },
    { label: 'EC-EARTH_RACM022E', value: 'ec_earth_racmo22e' },
    { label: 'EC-EARTH_RCA4', value: 'ec_earth_rca4' },
    { label: 'HadGEM2-ES_RACM022E', value: 'hadgem2_racmo22e' },
    { label: 'MPI-ESM-LR_REMO2009', value: 'mpi_esm_lr_remo2009' },
  ];

  const [localStart, setLocalStart] = useState<any>(0);
  const [localEnd, setLocalEnd] = useState<any>(100);
  const [localStartYear, setLocalStartYear] = useState<any>('');
  const [localEndYear, setLocalEndYear] = useState<any>('');

  useEffect(() => {
    setTimeseries([]);
    const baseSelection = Object.fromEntries(
      Object.entries(selected_map).filter(([key]) =>
        full_find_keys.includes(key),
      ),
    );
    // console.log(baseSelection)
    //const ids = models
    //  .filter(x => x)
    //  .map(model => {
    //    return scenarios.map(scenario => {
    //      const input = {
    //        ...baseSelection,
    //        data_series: 'yes',
    //        forecast_model: model,
    //        time_window: null,
    //        scenario,
    //      };
    //      const resItem = getItemByFilters(layers, input);
    //      // @ts-ignore
    //      return resItem ? resItem?.id : null;
    //    });
    //  })
    //  .flat();
    const ids = api.createIds(
      'tas_annual_absolute_model_ensemble-annual-model_ensemble-tas-absolute-{scenario}-year',
      {
        scenario: ['rcp26', 'rcp45', 'rcp85'],
      },
    );
    setIds(ids);
    api
      .getTimeseriesV2(ids, latLng.lat, latLng.lng, false)
      .then(res => {
        //@ts-ignore
        setTimeseries(res.series);
        setToDownload(res);
      })
      .catch(err => {
        console.log(err);
        dispatch(
          actions.actions.genericError({ error: 'app.error.dlTimeSeries' }),
        );
      });
  }, [
    selected_map,
    selectactable_parameters,
    models,
    setIds,
    api,
    latLng.lat,
    latLng.lng,
    scenarios,
    layers,
    dispatch,
    actions.actions,
  ]);

  const { t, i18n } = useTranslation();
  console.debug(i18n);

  const [nfltr, setNfltr] = useState<string>('MOVING_AVERAGE');
  const [mfltr, setMfltr] = useState<string>('model_ensemble');
  const [smfltr, setSMfltr] = useState<string>('model_ensemble');
  const [snsfltr, setSnsfltr] = useState<string>('NO_SMOOTHING');
  const [uncert, setUncert] = useState<boolean>(true);

  useEffect(()=>{
    setFilters(mfltr, smfltr, nfltr, snsfltr, uncert)
  }, [mfltr, smfltr, nfltr, snsfltr, uncert]);

  const toDisplay = x => {
    return x.name.indexOf('uncertainty');
  };

  const getLegend = () => {
    //TODO names lookup
    const series = timeseries
      ?.filter(x => !('uncertainty_type' in x.info))
      .filter(x => x.info.processing_method.indexOf(nfltr) >= 0)
      .filter(
        x =>
          x.info.climatological_model === mfltr ||
          x.name.length < 20 ||
          x.info.climatological_model === smfltr,
      )
      .map(item => getName(item));
    const station = timeseries
      ?.filter(x => Object.keys(x.info).indexOf('station_id') > 0)
      .filter(x => x.name.indexOf(snsfltr) >= 0)
      .map(x => getName(x));
    return [...series, ...station];
  };

  const getSelectedLegend = () => {
    //TODO names lookup
    let ret = {};
    timeseries
      ?.filter(x => !('uncertainty_type' in x.info))
      .filter(x => x.info.processing_method.indexOf(nfltr) >= 0)
      .filter(
        x =>
          x.name.indexOf(mfltr) >= 0 ||
          x.name.length < 20 ||
          x.name.indexOf(smfltr) >= 0,
      )
      .map(x => (ret[getName(x)] = true));
    timeseries
      ?.filter(x => Object.keys(x.info).indexOf('station_id') > 0)
      .filter(x => x.name.indexOf(snsfltr) >= 0)
      .map(x => (ret[getName(x)] = true));
    //.map(x => (ret[x.name] = x.info.processing_method === 'no_smoothing'));
    return ret;
  };

  const getColor = dataset => {
    if (dataset.info.scenario) {
      return colors[0][dataset.info.scenario];
    }
    return dataset.info.station_id ? '#45321b' : '#ff0000';
    //return dataset.forecast_model === models[0] ? 'solid' : 'dashed';
  };
  const getLineType = dataset => {
    return 'solid';
    //return dataset.forecast_model === models[0] ? 'solid' : 'dashed';
  };
  const getLineOpacity = dataset => {
    return 'uncertainty_type' in dataset.info ? 0 : 1;
    //return dataset.forecast_model === models[0] ? 1 : 0.8;
  };

  const getLineWidth = dataset => {
    return dataset.info.climatological_model === 'model_ensemble' ? 3 : 1;
  };

  const getSelected = dataset => {
    return dataset.info.processing_method === 'NO_SMOOTHING' ? true : false;
  };

  const getChartData = (item, series) => {
    if (
      'uncertainty_type' in item.info ||
      (item.info.processing_method.indexOf(nfltr) >= 0 &&
        (item.info.climatological_model === mfltr ||
          item.info.climatological_model === smfltr)) ||
      ('station_id' in item.info &&
        item.info.processing_method.indexOf(snsfltr) >= 0)
    ) {
      if (
        'uncertainty_type' in item.info &&
        item.info.uncertainty_type === 'upper_bound'
      ) {
        let ret: (number | null)[] = [];
        let lbitem = series.filter(x => {
          return (
            getName(x) === getName(item) &&
            x.info.aggregation_period === item.info.aggregation_period &&
            x.info.climatological_model === item.info.climatological_model &&
            x.info.climatological_variable ===
              item.info.climatological_variable &&
            x.info.measure === item.info.measure &&
            x.info.scenario === item.info.scenario &&
            x.info.year_period === item.info.year_period &&
            'uncertainty_type' in x.info &&
            x.info.uncertainty_type !== item.info.uncertainty_type
          );
        });
        let delta = parseInt(item.values[0].datetime.split('-')[0]) - baseValue;
        if (lbitem) {
          for (; delta > 0; delta--) {
            ret.push(null);
          }
          for (let i in item.values) {
            ret.push(
              item.values[i].value -
                lbitem[0].values.filter(x => x.value != null)[i].value,
            );
          }
        }
        return ret;
      }
    }
    item.values = item.values.filter(x => x.value != null);
    let delta = parseInt(item.values[0].datetime.split('-')[0]) - baseValue;
    console.log(item, delta);
    if (delta > 0)
      for (; delta > 0; delta--)
        item.values.unshift({
          value: null,
          datetime: baseValue + delta + '-01-01T04:00:00',
        });
    console.log(item);
    return item.values.map(x => x.value);
  };

  const getGraphType = dataset => {
    return dataset.info.station_id &&
      dataset.info.processing_method === 'NO_SMOOTHING'
      ? 'bar'
      : 'line';
  };
  const getZLevel = dataset => {
    return dataset.info.station_id ? 1000 : 10;
  };

  const getStack = dataset => {
    if ('uncertainty_type' in dataset.info)
      return getName(dataset).replaceAll(' ', '_');
    else return null;
  };
  const getAreaStyle = dataset => {
    if ('uncertainty_type' in dataset.info) {
      if (dataset.info.uncertainty_type === 'upper_bound') {
        if (dataset.info.scenario) {
          return { color: colors[1][dataset.info.scenario], opacity: 0.4 };
        }
      }
    }
    return null;
  };

  const getXAxis = () => {
    const cats = timeseries?.map(item => {
      return item.values.map(x => x.datetime.split('-')[0]);
    });
    return cats[0];
  };

  /*{
    "processing_method": "MOVING_AVERAGE_11_YEARS",
    "coverage_identifier": "tas_annual_absolute_model_ensemble_upper_uncertainty-annual-model_ensemble-tas-absolute-rcp26-upper_bound-year",
    "coverage_configuration": "tas_annual_absolute_model_ensemble_upper_uncertainty",
    "aggregation_period": "annual",
    "climatological_model": "model_ensemble",
    "climatological_variable": "tas",
    "measure": "absolute",
    "scenario": "rcp26",
    "uncertainty_type": "upper_bound",
    "year_period": "year"
}*/
  const getName = item => {
    let tdata: any = {};
    for (let k in item.translations.parameter_values) {
      tdata[k] = item.translations.parameter_values[k][i18n.language];
    }
    return `${tdata.climatological_variable} ${tdata.aggregation_period} ${tdata.climatological_model} ${tdata.measure} ${tdata.scenario} ${tdata.year_period} ${tdata.processing_method}`;
  };

  const pseriesObj = timeseries?.filter(item => {
    return (
      //(uncert && 'uncertainty_type' in item.info) ||
      //item.name.indexOf('_BOUND_') >= 0 &&
      (item.info.processing_method.indexOf(nfltr) >= 0 &&
        (item.info.climatological_model === mfltr ||
          item.info.climatological_model === smfltr)) ||
      ('station_id' in item.info && item.info.processing_method === snsfltr)
    );
  });

  const seriesObj = pseriesObj.map(item => ({
    id: item.name,
    name: getName(item),
    type: getGraphType(item),
    smooth: true,
    // sampling: 'average',
    symbol: 'none',
    lineStyle: {
      color: getColor(item),
      type: getLineType(item),
      opacity: getLineOpacity(item),
      width: getLineWidth(item),
    },
    itemStyle: {
      color: getColor(item),
      type: getLineType(item),
      opacity: getLineOpacity(item),
      width: getLineWidth(item),
    },
    selected: getSelected(item),
    data: getChartData(item, timeseries),
    stack: getStack(item),
    areaStyle: getAreaStyle(item),
    zLevel: getZLevel(item),
    label: {
      formatter: '{a}-{b}:{c}',
    },
  }));

  const titleText =
    timeseries.length === 0
      ? ''
      : `
  ${
    timeseries[0].translations.parameter_values.climatological_variable[
      i18n.language
    ]
  }
  ${
    timeseries[0].translations.parameter_values.aggregation_period[
      i18n.language
    ]
  }
  `;

  const subText =
    timeseries.length === 0
      ? ''
      : `
    ${timeseries[0].translations.parameter_values.measure[i18n.language]}  -  ${
          timeseries[0].translations.parameter_values.aggregation_period[
            i18n.language
          ]
        }  -  ${t('app.map.timeSeriesDialog.from')} ${formatYear(
          localStartYear,
        )} ${t('app.map.timeSeriesDialog.to')} ${formatYear(localEndYear)} - ${
          place ? place + ' - ' : ''
        }${t('app.map.timeSeriesDialog.lat')} ${roundTo4(latLng.lat)} ${t(
          'app.map.timeSeriesDialog.lng',
        )} ${roundTo4(latLng.lng)}     © ARPAV - Arpa FVG
  Si tratta di proiezioni climatiche e non di previsioni a lungo termine. Il valore annuale ha validità in un contesto di trend trentennale.`;

  const photoCameraIconPath =
    'path://M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z';

  const chartOption = {
    title: {
      text: titleText,
      subtext: subText,
      textStyle: isMobile ? { width: 300, overflow: 'break' } : {},
      subtextStyle: isMobile ? { width: 300, overflow: 'break' } : {},
      itemGap: -22,
      top: '5%',
      left: 'center',
    },
    color: seriesObj.map(x => x.lineStyle.color),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true,
          formatter: v =>
            `${t('app.map.timeSeriesDialog.xUnit')} ${
              v.value !== null ? roundTo4(v.value, 1).replace('.', ',') : '-'
            }`,
        },
      },
      valueFormatter: v =>
        `${v !== null ? roundTo4(v, 1).replace('.', ',') : '-'} ${
          timeseries[0]?.dataset?.unit
        }`,
    },
    legend: {
      data: getLegend(),
      selected: getSelectedLegend(),
      top: '30%',
      icon: 'rect',
    },
    grid: {
      top: '48%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      itemSize: 30,
      left: isMobile ? 'center' : 'right',
      feature: {
        myTool1: {
          show: true,
          title: 'Toggle uncertainty',
          icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
          onclick: () => {
            setUncert(!uncert);
          },
        },
        saveAsImage: {
          name: `Serie temporale ${findValueName(
            'variable',
            'variables',
          )} - ${joinNames([
            findValueName('forecast_model', 'forecast_models'),
            // findValueName('scenario', 'scenarios'),
          ])} - ${joinNames([
            findValueName('data_series', 'data_series'),
            findValueName('value_type', 'value_types'),
            findValueName('time_window', 'time_windows'),
          ])} - ${findValueName('year_period', 'year_periods')}`,
          title: t('app.map.timeSeriesDialog.saveAsImage'),
          icon: photoCameraIconPath,
          iconStyle: {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getXAxis(),
      axisLabel: {
        showMinLabel: false,
        rotate: 45,
        margin: 0,
        padding: 10,
        align: 'right',
        verticalAlign: 'top',
      },
      splitNumber: 10,
      name: t('app.map.timeSeriesDialog.xUnit'),
      nameLocation: isMobile ? 'middle' : 'end',
      nameGap: isMobile ? -15 : 15,
    },
    yAxis: {
      type: 'value',
      scale: true,
      name: timeseries[0]?.dataset?.unit ?? '',
      nameTextStyle: {
        align: 'center',
        padding: 15,
      },
    },
    dataZoom: [
      {
        start: localStart,
        end: localEnd,
        realtime: false,
        type: 'slider',
        height: 40,
      },
      {
        type: 'inside',
      },
    ],
    series: seriesObj,
  };

  const getMapsToDownloads = () => {
    const allIds = Object.entries(
      chartRef.current.getEchartsInstance().getOption().legend[0].selected,
    )
      .filter(x => !x[1])
      .map(x => x[0]);
    setIds(timeseries.filter(x => !allIds.includes(x.name)).map(x => x.name));
  };

  const dataZoomHandle = (params, chart) => {
    const { startValue, endValue, start, end } = chart.getOption().dataZoom[0];
    // const range = {
    //   start: timeserie[0].values[startValue].time,
    //   end: timeserie[0].values[endValue - 1].time,
    // };
    // console.log(startValue, endValue, range)
    // setTimeRange(range);

    if (start >= 0) {
      //console.log('[STF] dataZoomHandle(2)', start);
      setLocalStart(start);
    }
    if (end >= 0) {
      //console.log('[STF] dataZoomHandle(3)', end);
      setLocalEnd(end);
    }
    if (startValue >= 0) {
      //console.log('[STF] dataZoomHandle(4)', chart.getOption().xAxis[0].data[startValue]);
      setLocalStartYear(chart.getOption().xAxis[0].data[startValue]);
    }
    if (endValue >= 0) {
      //console.log('[STF] dataZoomHandle(5)', chart.getOption().xAxis[0].data[endValue]);
      setLocalEndYear(chart.getOption().xAxis[0].data[endValue]);
    }
  };

  const onStartValueChange = e => {
    const ec = chartRef.current.getEchartsInstance();
    chartOption.dataZoom[0]['start'] = Math.max(
      0,
      parseInt(e.target.value) - baseValue,
    );
    //setStartValue(e.target.value);
    ec.setOption(chartOption);
  };
  const onEndValueChange = e => {
    const ec = chartRef.current.getEchartsInstance();
    chartOption.dataZoom[0]['end'] = Math.min(
      123,
      parseInt(e.target.value) - baseValue,
    );
    //setEndValue(e.target.value);
    ec.setOption(chartOption);
  };

  function valuetext(value: number) {
    if (value === 0) return t('app.map.timeSeriesDialog.noSmoothing');
    else if (value === 1) return t('app.map.timeSeriesDialog.movingAverage');
    else if (value === 2) return t('app.map.timeSeriesDialog.loess');
  }
  function valuetextSensor(value: number) {
    if (value === 0) return t('app.map.timeSeriesDialog.noSmoothing');
    else if (value === 1)
      return t('app.map.timeSeriesDialog.movingAverageSensor');
  }

  useEffect(() => {
    if (getXAxis()) {
      setLocalStartYear(getXAxis()[0]);
      setLocalEndYear(getXAxis().slice(-1)[0]);
    }
  }, [getXAxis, timeseries]);

  const setSensorSmoothing = v => {
    if (v === 0) {
      setSnsfltr('NO_SMOOTHING');
    } else if (v === 1) {
      setSnsfltr('MOVING_AVERAGE');
    }
  };
  const setModelSmoothing = v => {
    if (v === 0) {
      setNfltr('NO_SMOOTHING');
    } else if (v === 1) {
      setNfltr('MOVING_AVERAGE');
    } else if (v === 2) {
      setNfltr('LOESS_SMOOTHING');
    }
  };

  return (
    <Box sx={TSDataContainerStyle}>
      <Box sx={RowContainerStyle}>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ width: '100%' }} size="small">
            <InputLabel id="SelectedModel" shrink={true}>
              {t('app.map.timeSeriesDialog.selectedModel')}
            </InputLabel>
            <TextField disabled value="Model Ensemble"></TextField>
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ width: '100%' }} size="small">
            <InputLabel id="SelectedModel">
              {t('app.map.timeSeriesDialog.comparisonModel')}
            </InputLabel>
            <Select
              labelId="SelectedModel"
              id="SelectedModel"
              value={smfltr}
              label={t('app.map.timeSeriesDialog.comparisonModel')}
              onChange={e =>
                setSMfltr(
                  (e.target.value as string).toLowerCase().replaceAll('-', '_'),
                )
              }
            >
              {gmodels.map(m => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ width: '50%', left: '25%' }} size="small">
            <InputLabel
              id="smoothingModel"
              sx={{
                position: 'absolute',
                left: '-79px',
                width: '300px',
                maxWidth: '300px',
                fontSize: '12px',
                top: '-17px',
              }}
            >
              {t('app.map.timeSeriesDialog.modelSmoothing')}
            </InputLabel>
            <Slider
              aria-label="Options"
              defaultValue={1}
              valueLabelFormat={valuetext}
              valueLabelDisplay="on"
              step={1}
              marks
              min={0}
              max={2}
              //@ts-ignore
              onChange={e => setModelSmoothing(e.target?.value)}
            />
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ width: '50%', left: '25%' }} size="small">
            <InputLabel
              id="sensorSmoothingModel"
              sx={{
                position: 'absolute',
                left: '-79px',
                width: '300px',
                maxWidth: '300px',
                fontSize: '12px',
                top: '-17px',
              }}
            >
              {t('app.map.timeSeriesDialog.sensorSmoothing')}
            </InputLabel>
            <Slider
              aria-label="Options"
              defaultValue={0}
              valueLabelFormat={valuetextSensor}
              valueLabelDisplay="on"
              step={1}
              marks
              min={0}
              max={1}
              //@ts-ignore
              onChange={e => setSensorSmoothing(e.target?.value)}
            />
          </FormControl>
        </Box>
      </Box>
      {timeseries?.length > 0 ? (
        <Box sx={ChartContainerStyle}>
          <ReactECharts
            ref={chartRef}
            option={chartOption}
            // style={{
            //   // minHeight: '70vh'
            //   minHeight: '550px'
            // }}
            onEvents={{
              // 'click': (A, B, C) => {console.log('click', A, B, C)},
              legendselectchanged: getMapsToDownloads,
              dataZoom: dataZoomHandle,
            }}
          />
        </Box>
      ) : (
        <Box sx={ChartLoaderContainerStyle}>
          <CircularProgress size={80} />
        </Box>
      )}
      <Box sx={FieldContainerStyle}>
        <Box>
          <input
            type="text"
            maxLength={4}
            placeholder="Da:"
            defaultValue={localStartYear}
            onChange={event => {
              setLocalStartYear(event?.target?.value);
              const startValue = chartRef.current
                .getEchartsInstance()
                .getOption()
                .xAxis[0].data.findIndex(
                  (item: any) => item === event?.target?.value,
                );
              const endValue = chartRef.current
                .getEchartsInstance()
                .getOption()
                .xAxis[0].data.findIndex((item: any) => item === localEndYear);
              //console.log('[STF]', startValue, endValue);
              if (startValue !== -1 && endValue !== -1) {
                chartRef.current.getEchartsInstance().dispatchAction({
                  type: 'dataZoom',
                  dataZoomIndex: 0,
                  startValue: startValue,
                  endValue: endValue,
                });
              }
            }}
          />
        </Box>
        <Box>
          <input
            type="text"
            maxLength={4}
            placeholder="A:"
            defaultValue={localEndYear}
            onChange={event => {
              setLocalEndYear(event?.target?.value);
              const startValue = chartRef.current
                .getEchartsInstance()
                .getOption()
                .xAxis[0].data.findIndex(
                  (item: any) => item === localStartYear,
                );
              const endValue = chartRef.current
                .getEchartsInstance()
                .getOption()
                .xAxis[0].data.findIndex(
                  (item: any) => item === event?.target?.value,
                );
              //console.log('[STF]', startValue, endValue);
              if (startValue !== -1 && endValue !== -1) {
                chartRef.current.getEchartsInstance().dispatchAction({
                  type: 'dataZoom',
                  dataZoomIndex: 0,
                  startValue: startValue,
                  endValue: endValue,
                });
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TSDataContainer;
