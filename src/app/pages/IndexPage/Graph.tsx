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
      histo: 'rgba(69,50,27, 0.4)',
      rcp26: 'rgba(46,105,193, 0.4)',
      rcp45: 'rgba(243, 156, 18, 0.4)',
      rcp85: 'rgba(231,60,60, 0.4)',
    },
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
            forecast_model: model,
            scenario,
          };
          const resItem = getItemByFilters(layers, input);
          // @ts-ignore
          return resItem ? resItem?.id : null;
        });
      })
      .flat();
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

  const [nfltr, setNfltr] = useState<string>('MOVING_AVERAGE');
  const [mfltr, setMfltr] = useState<string>('model_ensemble');
  const [smfltr, setSMfltr] = useState<string>('model_ensemble');
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

  const getName = item => {
    let tdata: any = {};
    for (let k in item.translations.parameter_values) {
      tdata[k] = item.translations.parameter_values[k][i18n.language];
    }
    return `${tdata.climatological_variable} ${tdata.aggregation_period} ${tdata.climatological_model} ${tdata.measure} ${tdata.scenario} ${tdata.year_period} ${tdata.processing_method}`;
  };

  let pseriesObj = [
    ...timeseries?.filter(item => {
      return (
        //no uncertainty
        !('uncertainty_type' in item.info) &&
        ((item.info.processing_method.indexOf(nfltr) >= 0 &&
          (item.info.climatological_model === mfltr ||
            item.info.climatological_model === smfltr)) ||
          ('series_elaboration' in item.info &&
            item.info.processing_method.indexOf(snsfltr) >= 0))
      );
    }),
  ];
  if (uncert)
    pseriesObj = [
      ...pseriesObj,
      ...timeseries?.filter(item => {
        return (
          //no uncertainty
          'uncertainty_type' in item.info &&
          ((item.info.processing_method.indexOf(nfltr) >= 0 &&
            (item.info.climatological_model === mfltr ||
              item.info.climatological_model === smfltr)) ||
            ('series_elaboration' in item.info &&
              item.info.processing_method.indexOf(snsfltr) >= 0))
        );
      }),
    ];

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

  const chartOption = {
    title: {
      text: 'Barometro Climatico',
      subtext: subText,
      textStyle: isMobile ? { width: 300, overflow: 'break' } : {},
      subtextStyle: isMobile ? { width: 300, overflow: 'break' } : {},
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
      valueFormatter: v =>
        `${v !== null ? roundTo4(v, 1).replace('.', ',') : '-'} °C`,
    },
    legend: {
      data: getLegend(),
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
      //feature: {
      //  saveAsImage: {
      //    name: `Barometro Climatico`,
      //    title: t('app.map.timeSeriesDialog.saveAsImage'),
      //    icon: photoCameraIconPath,
      //    iconStyle: {
      //      color: theme.palette.primary.main,
      //    },
      //  },
      //},
    },
    xAxis: {
      type: 'category',
      data: cats[0],
      boundaryGap: false,
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
