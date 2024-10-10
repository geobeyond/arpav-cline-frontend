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
// import { saveAs } from 'file-saver';

//TODO
// findValueName duplicated from src/app/components/DownloadDataDialog/mapDlData.tsx: put in utils ?
//    findValueName is similar to the one used in MapBar ?
// Use i18 for fields;

const Graph = (props: any) => {
  const api = RequestApi.getInstance();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));
  const [movingAvg, setMovingAvg] = useState(true);
  const chartRef = React.useRef<any>(null);

  const dispatch = useDispatch();
  const actions = useMapSlice();

  const mode = props.mode;

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
    { label: '--', value: 'model_ensemble' },
    { label: 'EC-EARTH_CCLM4-8-17', value: 'ec_earth_cclm_4_8_17' },
    { label: 'EC-EARTH_RACM022E', value: 'ec_earth_racmo22e' },
    { label: 'EC-EARTH_RCA4', value: 'ec_earth_rca4' },
    { label: 'HadGEM2-ES_RACM022E', value: 'hadgem2_racmo22e' },
    { label: 'MPI-ESM-LR_REMO2009', value: 'mpi_esm_lr_remo2009' },
  ];

  const [localStart, setLocalStart] = useState<any>(0);
  const [localEnd, setLocalEnd] = useState<any>(100);
  const [localStartYear, setLocalStartYear] = useState<any>(null);
  const [localEndYear, setLocalEndYear] = useState<any>(null);
  useEffect(() => {
    setTimeseries([]);
    const baseSelection = Object.fromEntries(
      Object.entries(selected_map).filter(([key]) =>
        full_find_keys.includes(key),
      ),
    );
    api
      .getBarometroClimatico()
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
    api,
    scenarios,
    layers,
    dispatch,
    actions.actions,
  ]);

  const { t, i18n } = useTranslation();
  console.debug(i18n);

  const [nfltr, setNfltr] = useState<string>('MOVING_AVERAGE_11_YEARS');
  const [mfltr, setMfltr] = useState<string>('barometro_climatico');
  const [smfltr, setSMfltr] = useState<string>('barometro_climatico');
  const [snsfltr, setSnsfltr] = useState<string>('NO_SMOOTHING');
  const [uncert, setUncert] = useState<boolean>(true);

  //const getLegend = () => {
  //  //TODO names lookup
  //  const legend = timeseries?.map(
  //    item =>
  //      `${findParamName(
  //        item.info.coverage_identifier,
  //        'scenarios',
  //      )} - ${findParamName(item.info.smoothing, 'forecast_models')}`,
  //  );
  //  return legend;
  //};

  const toDisplay = x => {
    return x.name.indexOf('uncertainty');
  };

  const range = (start: number, end: number): number[] => {
    let ret: number[] = [];
    for (let i: number = start; i < end; i++) {
      ret.push(i);
    }
    return ret;
  };

  const dataValues = timeseries.reduce((prev, curr) => {
    return {
      ...prev,
      ...{ [curr.name + '__' + curr.info.processing_method]: curr.values },
    };
  }, {});
  for (let k of Object.keys(dataValues)) {
    for (let kk of dataValues[k]) {
      kk.datetime = kk.datetime.split('-')[0];
    }
  }
  for (let k of Object.keys(dataValues)) {
    let vv: any[] = [];
    for (let y of range(baseValue, 2099)) {
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
      .map(item => ({
        name: getName(item),
        itemStyle: { color: getColor(item) },
      }));
    const station = timeseries
      ?.filter(x => Object.keys(x.info).indexOf('series_elaboration') > 0)
      .filter(x => x.info.processing_method.indexOf(snsfltr) >= 0)
      .map(x => ({
        name: getName(x, 'station'),
        itemStyle: { color: 'black' },
      }));
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
      ?.filter(x => Object.keys(x.info).indexOf('station') > 0)
      .filter(x => x.name.indexOf(snsfltr) >= 0)
      .map(x => (ret[getName(x, 'station')] = true));
    //.map(x => (ret[x.name] = x.info.processing_method === 'no_smoothing'));
    return ret;
  };

  const getColor = dataset => {
    if (dataset.info.scenario) {
      return colors[0][dataset.info.scenario];
    }
    return '#45321b';
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
    return dataset.info.climatological_model === 'model_ensemble' ||
      dataset.info.series_elaboration === 'ORIGINAL'
      ? 3
      : 1;
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
      ('series_elaboration' in item.info &&
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
            x.info.processing_method === nfltr &&
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
        if (lbitem.length > 0) {
          for (let i in dataValues[
            item.name + '__' + item.info.processing_method
          ]) {
            if (
              dataValues[item.name + '__' + item.info.processing_method][i]
                .value ||
              dataValues[
                lbitem[0].name + '__' + lbitem[0].info.processing_method
              ][i].value
            ) {
              ret.push(
                dataValues[item.name + '__' + item.info.processing_method][i]
                  .value -
                dataValues[
                  lbitem[0].name + '__' + lbitem[0].info.processing_method
                ][i].value,
              );
            } else {
              ret.push(null);
            }
          }
        }
        return ret;
      }
    }
    return dataValues[item.name + '__' + item.info.processing_method].map(
      x => x.value,
    );
  };

  const getGraphType = dataset => {
    return 'line';
  };
  const getStepType = dataset => {
    return dataset.info.series_elaboration &&
      dataset.info.processing_method === 'NO_SMOOTHING'
      ? 'middle'
      : false;
  };
  const getZLevel = dataset => {
    return dataset.info.series_elaboration &&
      dataset.info.processing_method === 'NO_SMOOTHING'
      ? 100
      : 10;
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
  const getName = (item, mode = 'timeseries') => {
    if ('station' in item.info) mode = 'sensor';
    let tdata: any = {};
    for (let k in item.translations.parameter_values) {
      tdata[k] = item.translations.parameter_values[k][i18n.language];
    }
    if (mode === 'timeseries')
      return `${tdata.climatological_model} ${tdata.scenario}`;
    else return `${tdata.station}`;
  };

  let pseriesObj = timeseries.filter(
    item => item.info.processing_method === 'MOVING_AVERAGE_11_YEARS',
  );

  let seriesObj = pseriesObj.map(item => ({
    id: item.name + '__' + item.info.processing_method,
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
    stackStrategy: 'all',
    areaStyle: getAreaStyle(item),
    zLevel: getZLevel(item),
    label: {
      formatter: '{a}-{b}:{c}',
    },
  }));

  seriesObj = seriesObj.sort((a, b) => {
    return a.id.indexOf('lower') >= 0 ? -1 : 1;
  });

  const cats = timeseries?.map(item => {
    return item.values.map(x => x.datetime.split('-')[0]);
  });

  const titleText = `
     ${findValueName('variable', 'variables')}
  `;

  const subText = `
    Barometro Climatico © ARPAV - Arpa FVG
  Si tratta di proiezioni climatiche e non di previsioni a lungo termine. Il valore annuale ha validità in un contesto di trend trentennale.`;

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
      //text: 'Barometro Climatico',
      subtext: subText,
      textStyle: isMobile ? { width: 400, overflow: 'break' } : {},
      subtextStyle: isMobile ? { width: 400, overflow: 'break' } : {},
      itemGap: 0,
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
            `${t('app.map.timeSeriesDialog.xUnit')} ${v.value !== null ? roundTo4(v.value, 1).replace('.', ',') : '-'
            }`,
        },
      },
      valueFormatter: (v, i) => {
        return `${v !== null ? roundTo4(v, 1).replace('.', ',') : '-'} °C`;
      },

      formatter: p => {
        console.log(p);
        if (!p.length) p = [p]; // default trigger:'item'
        let tt = p.map(x => {
          if (dataValues[x.seriesId]?.length > x.dataIndex) {
            if (dataValues[x.seriesId][x.dataIndex].value) {
              return (
                '<br>' +
                x.marker +
                x.seriesName +
                getBoundsLabel(x.seriesId) +
                ': ' +
                dataValues[x.seriesId][x.dataIndex]?.value
                  ?.toFixed(1)
                  .replace('.', i18n.language === 'en' ? '.' : ',') +
                ' °C'
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
          name: `Barometro Climatico`,
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
      name: '°C',
      nameTextStyle: {
        align: 'center',
        padding: 15,
      },
    },
    series: seriesObj,
  };

  return (
    <Box sx={TSDataContainerStyle}>
      {timeseries?.length > 0 ? (
        <Box sx={ChartContainerStyle}>
          <ReactECharts
            ref={chartRef}
            option={chartOption}
          // style={{
          //   // minHeight: '70vh'
          //   minHeight: '550px'
          // }}
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

export default Graph;
