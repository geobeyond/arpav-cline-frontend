import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from '@mui/material';
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
}

//TODO
// findValueName duplicated from src/app/components/DownloadDataDialog/mapDlData.tsx: put in utils ?
//    findValueName is similar to the one used in MapBar ?
// Use i18 for fields;

const TSDataContainer = (props: TSDataContainerProps) => {
  const { latLng, setIds, setTimeRange, place = '' } = props;
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
    'Media ensamble',
    'EC-EARTH_CCLM4-8-17',
    'EC-EARTH_RACM022E',
    'EC-EARTH_RCA4',
    'HadGEM2-ES_RACM022E',
    'MPI-ESM-LR_REMO2009',
  ];

  useEffect(() => {
    setTimeseries([]);
    const baseSelection = Object.fromEntries(
      Object.entries(selected_map).filter(([key]) =>
        full_find_keys.includes(key),
      ),
    );
    // console.log(baseSelection)
    const ids = models
      .filter(x => x)
      .map(model => {
        return scenarios.map(scenario => {
          const input = {
            ...baseSelection,
            data_series: 'yes',
            forecast_model: model,
            time_window: null,
            scenario,
          };
          const resItem = getItemByFilters(layers, input);
          // @ts-ignore
          return resItem ? resItem?.id : null;
        });
      })
      .flat();
    setIds(ids);
    api
      .getTimeseriesV2(ids, latLng.lat, latLng.lng, true)
      .then(res => {
        //@ts-ignore
        setTimeseries(res.series);
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

  const { t } = useTranslation();

  const getLegend = () => {
    //TODO names lookup
    const legend = timeseries
      ?.filter(x => x.name.indexOf('_BOUND_') < 0)
      .map(item => item.name);
    return legend;
  };

  const getSelectedLegend = () => {
    //TODO names lookup
    let ret = {};
    const legend = timeseries
      ?.filter(x => x.name.indexOf('_BOUND_') < 0)
      .map(x => (ret[x.name] = x.info.smoothing === 'no_smoothing'));
    return ret;
  };

  const getColor = dataset => {
    for (let k in colors[0]) {
      if (dataset.name.indexOf(k) >= 0) {
        return colors[0][k];
      }
    }
    return dataset.info.station_id ? '#45321b' : '#ff0000';
    //return dataset.forecast_model === models[0] ? 'solid' : 'dashed';
  };
  const getLineType = dataset => {
    return 'solid';
    //return dataset.forecast_model === models[0] ? 'solid' : 'dashed';
  };
  const getLineOpacity = dataset => {
    return dataset.name.indexOf('_BOUND_') > 0 ? 0 : 1;
    //return dataset.forecast_model === models[0] ? 1 : 0.8;
  };

  const getLineWidth = dataset => {
    return dataset.info.smoothing === 'no_smoothing' ? 2 : 1;
  };

  const getSelected = dataset => {
    return dataset.info.smoothing === 'no_smoothing' ? true : false;
  };

  const getChartData = (item, series) => {
    if (item.name.indexOf('_BOUND_') >= 0) {
      if (item.name.indexOf('UPPER') >= 0) {
        let ret: number[] = [];
        let lbitem = series.filter(
          x => x.name === item.name.replace('UPPER', 'LOWER'),
        );
        if (lbitem)
          for (let i in item.values) {
            ret.push(item.values[i].value - lbitem[0].values[i].value);
          }
        return ret;
      }
    }
    return item.values.map(x => x.value);
  };

  const getGraphType = dataset => {
    return dataset.info.station_id ? 'bar' : 'line';
  };
  const getZLevel = dataset => {
    return dataset.info.station_id ? 1000 : 10;
  };

  const getStack = dataset => {
    return dataset.name.indexOf('_BOUND_') > 0
      ? dataset.info.smoothing
      : dataset.name;
  };
  const getAreaStyle = dataset => {
    if (dataset.name.indexOf('_UPPER_BOUND_') > 0) {
      for (let k in colors[1]) {
        if (dataset.name.indexOf(k) >= 0) {
          return colors[1][k];
        }
      }
    } else {
      return null;
    }
  };

  const getXAxis = () => {
    const cats = timeseries?.map(item => {
      return item.values.map(x => x.datetime.split('-')[0]);
    });
    return cats[0];
  };

  const seriesObj = timeseries?.map(item => ({
    name: item.name
      .replace('_UNCERTAINTY_LOWER_BOUND_', '')
      .replace('_UNCERTAINTY_UPPER_BOUND_', ''),
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
  }));

  const titleText = `
     ${findValueName('variable', 'variables')}
  `;

  const subText = `
    ${findValueName('value_type', 'value_types')}  -  ${findValueName(
    'year_period',
    'year_periods',
  )}  -  ${t('app.map.timeSeriesDialog.from')} ${formatYear(
    selected_map.time_start,
  )} ${t('app.map.timeSeriesDialog.to')} ${formatYear(
    selected_map.time_end,
  )} - ${place ? place + ' - ' : ''}${t(
    'app.map.timeSeriesDialog.lat',
  )} ${roundTo4(latLng.lat)} ${t('app.map.timeSeriesDialog.lng')} ${roundTo4(
    latLng.lng,
  )}     © ARPAV - Arpa FVG
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
    const { startValue, endValue } = chart.getOption().dataZoom[0];
    const range = {
      start: timeserie[0].values[startValue].time,
      end: timeserie[0].values[endValue - 1].time,
    };
    // console.log(startValue, endValue, range)
    setTimeRange(range);
  };

  return (
    <Box sx={TSDataContainerStyle}>
      <Box sx={RowContainerStyle}>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="SelectedModel">
              {t('app.map.timeSeriesDialog.selectedModel')}
            </InputLabel>
            <Select
              labelId="SelectedModel"
              id="SelectedModel"
              value={models[0]}
              label={t('app.map.timeSeriesDialog.selectedModel')}
              onChange={e => setModel([e.target.value as string, models[1]])}
            >
              {forecast_models.map(m => (
                <MenuItem value={m} disabled={m === models[1]}>
                  {findParamName(m, 'forecast_models')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="SelectedModel">
              {t('app.map.timeSeriesDialog.comparisonModel')}
            </InputLabel>
            <Select
              labelId="SelectedModel"
              id="SelectedModel"
              value={models[1]}
              label={t('app.map.timeSeriesDialog.comparisonModel')}
              onChange={e => setModel([models[0], e.target.value as string])}
            >
              {forecast_models.map(m => (
                <MenuItem key={m} value={m} disabled={m === models[0]}>
                  {findParamName(m, 'forecast_models')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <FormControlLabel
              control={
                <Switch
                  checked={movingAvg}
                  onChange={e => setMovingAvg(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={t('app.map.timeSeriesDialog.movingAverage')}
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
    </Box>
  );
};

export default TSDataContainer;
