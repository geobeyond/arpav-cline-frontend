import React from 'react';
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
} from './styles';
import { DownloadMap } from './DownloadMap';
import { roundTo4 } from '../../../utils/json_manipulations';

export interface MapDlDataProps {
  // getMapImg: Function;
  onChange?: (values: any) => void;
}

const MapDlData = (props: MapDlDataProps) => {
  const onChange = props.onChange ?? (() => {});

  const { t } = useTranslation();

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
  };

  const changeBounds = bounds => {
    setDownLoadBounds(bounds);
    JSON.stringify(bounds) !== JSON.stringify(mapBounds)
      ? setShowReset(true)
      : setShowReset(false);
  };

  const times = timeserie ? timeserie[0].values.map(v => v.time) : [];
  const timeKeys = [...times.keys()];

  const [years, setYears] = React.useState<number[]>([0, timeKeys.length - 1]);

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
  }, [onChange, times, years]);

  React.useEffect(() => {
    const values = {};
    values['north'] = parseFloat(downLoadBounds[1][0]);
    values['south'] = parseFloat(downLoadBounds[0][0]);
    values['east'] = parseFloat(downLoadBounds[1][1]);
    values['west'] = parseFloat(downLoadBounds[0][1]);
    onChange(values);
  }, [downLoadBounds, onChange]);

  return (
    <Box sx={MapDataContainerStyle}>
      <Box>
        {/*Column1*/}
        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.menuBar.indicator')}
          </Typography>
          <Typography variant={'body1'} sx={MapDataValueTextStyle}>
            {findValueName('variable', 'variables')}
          </Typography>
        </Box>
        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.menuBar.model')}
          </Typography>
          <Typography variant={'body1'} sx={MapDataValueTextStyle}>
            {joinNames([
              findValueName('forecast_model', 'forecast_models'),
              findValueName('scenario', 'scenarios'),
            ])}
          </Typography>
        </Box>
        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.menuBar.period')}
          </Typography>
          <Typography variant={'body1'} sx={MapDataValueTextStyle}>
            {joinNames([
              findValueName('data_series', 'data_series'),
              findValueName('value_type', 'value_types'),
              findValueName('time_window', 'time_windows'),
            ])}
          </Typography>
        </Box>
        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.menuBar.season')}
          </Typography>
          <Typography variant={'body1'} sx={MapDataValueTextStyle}>
            {findValueName('year_period', 'year_periods')}
          </Typography>
        </Box>
        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.downloadDataDialog.map.unit')}
          </Typography>
          <Typography variant={'body1'} sx={MapDataValueTextStyle}>
            {selected_map?.unit}
          </Typography>
        </Box>
        <Box sx={FieldContainerStyle}>
          <Typography variant={'h6'} sx={MapDataSectionTextStyle}>
            {t('app.map.downloadDataDialog.map.timeRange')}
          </Typography>
          <Box sx={SliderContainerStyle}>
            <span>{times[years[0]].substring(4, 0)}</span>
            <Slider
              sx={YearsSliderStyle}
              getAriaValueText={() =>
                t('app.map.downloadDataDialog.map.timeRangeLabel')
              }
              // valueLabelDisplay="on"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={times.length - 1}
              value={years}
              onChange={yearsHandleChange}
              valueLabelFormat={index => times[index].substring(4, 0)}
              disableSwap
            />
            <span>{times[years[1]].substring(4, 0)}</span>
          </Box>
        </Box>
      </Box>
      <Box>
        {/*Column2*/}
        <Box sx={FieldContainerStyle}>
          <DownloadMap mapBounds={mapBounds} downLoadBounds={downLoadBounds} />
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
          {showReset && (
            <Button size={'small'} onClick={resetBounds}>
              Ripristina coordinate originali
            </Button>
          )}
          {/*{JSON.stringify(downLoadBounds)}*/}
        </Box>
      </Box>
    </Box>
  );
};

export default MapDlData;
