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
  Button,
  FormLabel,
  Radio,
  useMediaQuery,
  TextField,
  InputAdornment,
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
import { TSDataContainerProps } from './TSDataContainer';
// import { saveAs } from 'file-saver';

//TODO
// findValueName duplicated from src/app/components/DownloadDataDialog/mapDlData.tsx: put in utils ?
//    findValueName is similar to the one used in MapBar ?
// Use i18 for fields;

const TSDataContainerHistoric = (props: TSDataContainerProps) => {
  const {
    latLng,
    setIds,
    setTimeRange,
    place = '',
    setToDownload = () => { },
    currentLayer,
    currentMap,
    setFilters = (
      mainModel,
      secondaryModel,
      tsSmoothing,
      sensorSmoothing,
      uncertainty,
    ) => { },
    setSeriesFilter = () => { },
    setFilledSeries = () => { },
    mode,
    map_data,
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
  const baseValue: number = 1984;
  const yeardelta: number = 2;
  const endValue: number = new Date().getFullYear();

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
  const colors = {
    no_processing: 'rgb(0, 0, 0)',
    less_smoothing: 'rgb(0, 0, 0)',
    moving_average_5_years: 'rgb(0, 0, 0)',
    mann_kendall_trend: 'rgb(178, 30, 30)',
    decade_aggregation: 'rgb(161, 185, 218)',
  };

  const [localStart, setLocalStart] = useState<any>(0);
  const [localEnd, setLocalEnd] = useState<any>(100);
  const [localStartYear, setLocalStartYear] = useState<any>(baseValue);
  const [localEndYear, setLocalEndYear] = useState<any>(endValue);
  const [realDataValues, setRealDataValues] = useState<any>({});

  const [mkStartYear, setMKStartYear] = useState<number>(
    new Date().getFullYear() - 30,
  );
  const [mkEndYear, setMKEndYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const do_effect = async () => {
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

      let ids = await api.createIds({
        ...currentMap,
        ...{
          scenario: ['rcp26', 'rcp45', 'rcp85'],
        },
        ...{ data_series: true },
      });
      if (currentLayer.ensemble_data) {
        ids = await api.createIds({
          ...currentMap,
          ...{ climatological_model: ['model_ensemble'] },
          ...{
            scenario: ['rcp26', 'rcp45', 'rcp85'],
          },
          ...{ data_series: true },
        });
      }
      console.log(ids);
      setIds(ids);
      api
        .getTimeseriesV2(
          ids,
          latLng.lat,
          latLng.lng,
          true,
          map_data,
          mkStartYear.toString(),
          mkEndYear.toString(),
        )
        .then(res => {
          //@ts-ignore
          setTimeseries(res.series);
          setToDownload({ ...res });

          const dataValues = res.series.reduce((prev, curr) => {
            return {
              ...prev,
              ...{
                [curr.name]: curr.values,
              },
            };
          }, {});
          for (let k of Object.keys(dataValues)) {
            for (let kk of dataValues[k]) {
              kk.datetime = kk.datetime.split('-')[0];
            }
          }
          for (let k of Object.keys(dataValues)) {
            let vv: any[] = [];
            for (let y of range(baseValue, endValue)) {
              let found: boolean | any = false;
              for (let kk of dataValues[k]) {
                if (y.toString() === kk.datetime) {
                  found = kk;
                  break;
                }
              }
              if (found) {
                vv.push(found);
              } else {
                vv.push({
                  value: null,
                  datetime: y.toString(),
                });
              }
            }
            dataValues[k] = vv;
          }
          console.log(dataValues);
          setFilledSeries(dataValues);
          setRealDataValues(dataValues);
        })
        .catch(err => {
          console.log(err);
          dispatch(
            actions.actions.genericError({ error: 'app.error.dlTimeSeries' }),
          );
        });
    };
    if (
      mkStartYear > baseValue &&
      mkEndYear - mkStartYear >= 27 &&
      mkEndYear <= new Date().getFullYear()
    )
      do_effect().catch(console.error);
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
    currentLayer.coverage_id_pattern,
    currentLayer.name,
    currentMap,
    setToDownload,
    currentLayer.ensemble_data,
    setFilledSeries,
    mkStartYear,
    mkEndYear,
  ]);

  const { t, i18n } = useTranslation();
  console.debug(i18n);

  const [processingMethod, setProcessingMethod] =
    useState<string>('no_processing');

  const [uncert, setUncert] = useState<boolean>(true);

  const [pseriesObj, setPseriesObj] = useState<any>([]);

  useEffect(() => {
    setFilters(processingMethod, uncert);
  }, [processingMethod, uncert]);

  useEffect(() => {
    setFilters(processingMethod, uncert);

    setTimeRange({
      ...{
        start: 0,
        end: endValue - baseValue,
      },
      ...{
        start: localStartYear - baseValue,
        end: localEndYear - baseValue,
      },
    });
  });

  const toDisplay = x => {
    return x.name.indexOf('uncertainty');
  };

  const range = (start: number, end: number): number[] => {
    let ret: number[] = [];
    for (let i: number = start; i <= end; i++) {
      ret.push(i);
    }
    return ret;
  };

  const getLegend = () => {
    //TODO names lookup
    const series = timeseries
      ?.filter(x => x.info.processing_method.indexOf(processingMethod) >= 0)
      .map(item => ({
        name: getName(item),
        itemStyle: { color: getColor(item), opacity: 1 },
      }));
    const aggregations = timeseries
      ?.filter(
        x =>
          x.info.processing_method === 'mann_kendall_trend' ||
          x.info.processing_method === 'decade_aggregation',
      )
      .map(x => ({
        name: getName(x),
        itemStyle: { color: getColor(x), opacity: 1 },
      }));
    if (series && aggregations) {
      return [...series, ...aggregations];
    } else {
      return [];
    }
  };

  const getSelectedLegend = () => {
    //TODO names lookup
    let ret = {};
    timeseries
      ?.filter(x => x.info.processing_method.indexOf(processingMethod) >= 0)
      .map(x => (ret[getName(x)] = true));
    timeseries
      ?.filter(
        x =>
          x.info.processing_method === 'mann_kendall_trend' ||
          x.info.processing_method === 'decade_aggregation',
      )
      .map(x => (ret[getName(x)] = true));
    //.map(x => (ret[x.name] = x.info.processing_method === 'no_processing'));
    return ret;
  };

  const getColor = dataset => {
    return colors[dataset.info.processing_method];
    //return dataset.forecast_model === models[0] ? 'solid' : 'dashed';
  };
  const getLineType = dataset => {
    return dataset.info.processing_method === 'mann_kendall_trend' &&
      !dataset.info.processing_method_info.is_statistically_significant
      ? 'dashed'
      : 'solid';
  };
  const getLineOpacity = dataset => {
    return dataset.info.dataset_type.indexOf('uncertainty') >= 0 ? 0 : 1;
    //return dataset.forecast_model === models[0] ? 1 : 0.8;
  };

  const getLineWidth = dataset => {
    return 3;
  };

  const getSelected = dataset => {
    return dataset.info.processing_method.indexOf(processingMethod) >= 0
      ? true
      : false;
  };

  const getChartData = (item, series) => {
    return realDataValues[item.name].map(x => x.value);
  };

  const getGraphType = dataset => {
    return 'line';
  };
  const getStepType = dataset => {
    return dataset.info.processing_method === 'decade_aggregation'
      ? 'end'
      : dataset.info.processing_method === 'no_processing'
        ? 'middle'
        : false;
  };
  const getZLevel = dataset => {
    return dataset.info.series_elaboration &&
      dataset.info.processing_method === 'no_processing'
      ? 100
      : 10;
  };

  const getXAxis = () => {
    const cats = Object.values(realDataValues).map((item: any) => {
      return item.map(x => x.datetime.split('-')[0]);
    });
    if (cats) {
      if (cats.length > 0) {
        return cats[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const getName = item => {
    try {
      let ret = item.info.station_name
        ? item.info.station_name
        : t('app.map.timeSeriesDialog.interpolated');

      ret += ' - ';
      ret +=
        item.translations.parameter_values.processing_method[i18n.language];

      if (
        item.info.processing_method === 'mann_kendall_trend' &&
        item.info.processing_method_info?.is_statistically_significant
      ) {
        ret +=
          ': ' +
          (item.info.processing_method_info?.slope > 0 ? '+' : '-') +
          (item.info.processing_method_info?.slope * 10).toFixed(
            currentLayer?.data_precision,
          );
        ret += ' ' + currentLayer?.unit_english + '/10y';
      }

      return ret;
    } catch (ex) {
      console.log(ex);
      return item.name;
    }
  };

  useEffect(() => {
    if (timeseries) {
      let pseriesObj = [...timeseries];
      setPseriesObj(pseriesObj);
    }
  }, [timeseries, processingMethod]);

  let seriesFilter = pseriesObj.reduce((prev, item) => {
    const onV = getName(item);
    const whV = item.name;

    if (prev[onV]) {
      prev[onV] = {
        name: onV,
        series: [...prev[onV].series, whV],
        show: true,
      };
    } else {
      prev[onV] = {
        name: onV,
        series: [whV],
        show: true,
      };
    }

    return prev;
  }, {});

  let opseriesObj = [
    pseriesObj.filter(
      x => x.info.processing_method.indexOf(processingMethod) >= 0,
    )[0],
    pseriesObj.filter(
      x => x.info.processing_method === 'decade_aggregation',
    )[0],
    pseriesObj.filter(
      x => x.info.processing_method === 'mann_kendall_trend',
    )[0],
  ];

  const legendselected = event => {
    //@ts-ignore
    seriesFilter[item.name].show = !seriesFilter[item.name].show;
    console.log(seriesFilter);
  };

  let seriesObj = opseriesObj.map(item => {
    if (item)
      return {
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
        step: getStepType(item),
        z: getZLevel(item),
        label: {
          formatter: '{a}-{b}:{c}',
        },
      };
  });

  let titleText = '';
  if (timeseries) {
    if (timeseries?.length > 0) {
      if (
        timeseries[0].translations?.parameter_values?.climatological_variable
      ) {
        titleText =
          timeseries[0].translations?.parameter_values?.climatological_variable[
          i18n.language
          ];
      } else if (timeseries[0].translations?.parameter_values?.variable) {
        titleText =
          timeseries[0].translations?.parameter_values?.variable[i18n.language];
      } else {
        titleText =
          timeseries[0].translations?.parameter_values?.series_name[
          i18n.language
          ];
      }
    }
  }

  let subText = timeseries
    ? timeseries?.length === 0
      ? ''
      : `
    ${timeseries[0].info?.climatological_variable} -  ${t(
        'app.map.timeSeriesDialog.from',
      )} ${formatYear(localStartYear)} ${t(
        'app.map.timeSeriesDialog.to',
      )} ${formatYear(localEndYear)} - ${place ? place + ' - ' : ''}${t(
        'app.map.timeSeriesDialog.lat',
      )} ${roundTo4(latLng.lat)} ${t(
        'app.map.timeSeriesDialog.lng',
      )} ${roundTo4(latLng.lng)}; ${timeseries[0].info.station_name
        ? ''
        : '\n' + t('app.map.timeSeriesDialog.histWarning')
      } © ARPAV - Arpa FVG`
    : '';

  const photoCameraIconPath =
    'path://M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z';

  const getBoundsLabel = name => {
    if (name.indexOf('upper') >= 0)
      return i18n.language === 'en' ? ' Upper bound' : ' Limite superiore';
    if (name.indexOf('lower') >= 0)
      return i18n.language === 'en' ? ' Lower bound' : ' Limite inferiore';
    return '';
  };

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
    color: seriesObj.map(x => x?.lineStyle.color),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true,
          formatter: v => {
            return `${t('app.map.timeSeriesDialog.xUnit')} ${v.value !== null ? roundTo4(v.value, 1).replace('.', ',') : '-'
              }`;
          },
        },
      },
      valueFormatter: v =>
        `${v !== null ? roundTo4(v, 1).replace('.', ',') : '-'} ${i18n.language === 'en'
          ? currentLayer?.unit_english
          : currentLayer?.unit_italian
        }`,

      formatter: p => {
        if (!p.length) p = [p]; // default trigger:'item'
        let tt = p.map(x => {
          if (realDataValues[x.seriesId].length > x.dataIndex) {
            if (!isNaN(realDataValues[x.seriesId][x.dataIndex].value)) {
              return (
                '<br>' +
                x.marker +
                x.seriesName +
                getBoundsLabel(x.seriesId) +
                ': ' +
                realDataValues[x.seriesId][x.dataIndex]?.value
                  ?.toFixed(currentLayer?.data_precision)
                  .replace('.', i18n.language === 'en' ? '.' : ',') +
                ' ' +
                (i18n.language === 'en'
                  ? currentLayer?.unit_english
                  : currentLayer?.unit_italian)
              );
            }
          } else {
            return '';
          }
        });
        return tt + '';
      },
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
          name: `Serie temporale ${joinNames([
            currentMap.climatological_variable,
            currentMap.climatological_model,
            currentMap.scenario,
            currentMap.measure,
            currentMap.aggregation_period,
            currentMap.year_period,
            localStartYear,
            localEndYear,
          ])}`,
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
      name:
        (i18n.language === 'en'
          ? currentLayer?.unit_english
          : currentLayer?.unit_italian) || '',
      nameTextStyle: {
        align: 'center',
        padding: 5,
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

  console.log(chartOption);

  const getSeries = name => {
    return [];
  };

  const getMapsToDownloads = ev => {
    console.log(ev);
    console.log(seriesFilter);
    for (let s of getSeries(ev.name)) {
      seriesFilter.map();
    }
    const allIds = Object.entries(
      chartRef.current.getEchartsInstance().getOption().legend[0].selected,
    )
      .filter(x => x[1])
      .map(x => x[0]);
    console.log(allIds);
    const sf = Object.values(seriesFilter)
      .filter((x: any) => allIds.indexOf(x.name) >= 0)
      .map((x: any) => x.series);
    setSeriesFilter(sf);
    setIds(timeseries?.filter(x => !allIds.includes(x.name)).map(x => x.name));
  };

  const str = (start, end) => {
    console.log('[STF] str()', start, end);
    const range = {
      start: parseInt(start) - baseValue,
      end: parseInt(end) - baseValue,
    };

    if (range.start > 0 && range.end > 0) {
      setTimeRange({ ...range });
    }
  };

  const dataZoomHandle = (params, chart) => {
    const { startValue, endValue, start, end } = chart.getOption().dataZoom[0];

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

    str(
      chart.getOption().xAxis[0].data[startValue],
      chart.getOption().xAxis[0].data[endValue],
    );
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
    else if (value === 1)
      return t('app.map.timeSeriesDialog.movingAverageSensor');
  }

  useEffect(() => {
    if (getXAxis()) {
      if (localStartYear === null) {
        setLocalStartYear(getXAxis()[0]);
      }
      if (localStartYear === null) {
        setLocalEndYear(getXAxis().slice(-1)[0]);
      }
    }
  }, [getXAxis, timeseries]);

  const setModelSmoothing = v => {
    if (v === 0) {
      setProcessingMethod('no_processing');
    } else if (v === 1) {
      setProcessingMethod('moving_average_5_years');
    }
  };

  const recalculate = () => { };

  return (
    <Box sx={TSDataContainerStyle}>
      <Box sx={RowContainerStyle}>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ width: '100%' }} size="small">
            <InputLabel id="SelectedModel" shrink={true}>
              {t('app.map.timeSeriesDialog.mannkendall')}
            </InputLabel>
            <TextField
              defaultValue={mkStartYear}
              type="number"
              disabled={mode === 'simple'}
              onChange={e => setMKStartYear(parseInt(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">From: </InputAdornment>
                ),
              }}
            ></TextField>
            <TextField
              defaultValue={mkEndYear}
              type="number"
              disabled={mode === 'simple'}
              onChange={e => setMKEndYear(parseInt(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">To: </InputAdornment>
                ),
              }}
            ></TextField>
            <Button
              variant="contained"
              disabled={
                mkStartYear > mkEndYear ||
                mkEndYear - mkStartYear < 27 ||
                mkStartYear < baseValue ||
                mkEndYear > new Date().getFullYear()
              }
              onClick={recalculate}
            >
              {mkStartYear > mkEndYear ||
                mkEndYear - mkStartYear < 27 ||
                mkStartYear < baseValue ||
                mkEndYear > new Date().getFullYear()
                ? t('app.map.timeSeriesDialog.mkError')
                : t('app.map.timeSeriesDialog.mkOk')}
            </Button>
          </FormControl>
        </Box>

        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ width: '100%', left: '25%' }} size="small">
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
              {t('app.map.timeSeriesDialog.sensorSmoothing')}
            </InputLabel>
            <Slider
              disabled={mode === 'simple'}
              aria-label="Options"
              defaultValue={0}
              valueLabelFormat={valuetext}
              valueLabelDisplay="on"
              step={1}
              marks
              min={0}
              max={1}
              //@ts-ignore
              onChange={e => setModelSmoothing(e.target?.value)}
            />
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}></Box>
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
        <Box sx={RowContainerStyle}>
          <span>Da:</span>&nbsp;&nbsp;
          <input
            type="text"
            maxLength={4}
            placeholder="Da:"
            value={localStartYear}
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
              str(startValue, endValue);
            }}
          />
        </Box>
        <Box sx={RowContainerStyle}>
          <span>A:</span>&nbsp;&nbsp;
          <input
            type="text"
            maxLength={4}
            placeholder="A:"
            value={localEndYear}
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
              str(startValue, endValue);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TSDataContainerHistoric;
