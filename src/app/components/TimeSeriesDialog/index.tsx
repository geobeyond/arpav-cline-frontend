import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Modal, Typography } from '@mui/material';
import ExitIcon from '@mui/icons-material/HighlightOff';
import Grid from '@mui/material/Unstable_Grid2';
import { LatLng } from 'leaflet';
import {
  CloseIconContStyle,
  TSContainerStyle,
  TSModalStyle,
  TitleTSStyle,
} from './styles';
import TSDataContainer from './TSDataContainer';
import { iCityItem } from '../../pages/MapPage/slice/types';
import { DownloadForm } from './DownloadForm';
import { selectMap } from '../../pages/MapPage/slice/selectors';
import { useSelector } from 'react-redux';

export interface TimeSeriesDialogProps {
  selectedPoint: iCityItem | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentLayer: any;
  currentMap: any;
  mode: string;
  map_data: string;
}

export interface TimeRangeProps {
  start: string;
  end: string;
}

const TimeSeriesDialog = (props: TimeSeriesDialogProps) => {
  const {
    open = false,
    setOpen,
    selectedPoint,
    currentLayer,
    currentMap,
    mode,
    map_data,
  } = props;
  const latLng = selectedPoint
    ? new LatLng(selectedPoint.latlng.lat, selectedPoint.latlng.lng)
    : null;
  const place = selectedPoint ? selectedPoint.name : null;
  const { timeserie } = useSelector(selectMap);

  const { t } = useTranslation();

  const ids = useRef<number[]>([]);
  const data = useRef<any[]>([]);
  const filter = useRef<any>({
    mainModel: 'model_ensemble',
    secondaryModel:
      currentMap.climatological_model === 'model_ensemble'
        ? 'model_ensemble'
        : currentMap.climatological_model,
    tsSmoothing: 'MOVING_AVERAGE_11_YEARS',
    sensorSmoothing: 'NO_SMOOTHING',
    uncertainty: true,
  });
  const timeRange = useRef<TimeRangeProps | null>();
  // console.log(timeRange);
  const setIds = newIds => (ids.current = [...newIds]);
  let filledSeries = useRef<any[]>([]);
  const setFilledSeries = f => {
    filledSeries.current = { ...f };
  };
  const setTimeRange = tr => {
    timeRange.current = { ...tr };
  };

  const setToDownload = d => {
    data.current = { ...d };
  };

  const setSeriesFilter = f => {
    filter.current = { ...filter.current, ...{ series: f } };
  };

  const setFilters = (
    mainModel,
    secondaryModel,
    tsSmoothing,
    sensorSmoothing,
    uncertainty,
    series?,
  ) => {
    filter.current = {
      mainModel,
      secondaryModel,
      tsSmoothing,
      sensorSmoothing,
      uncertainty,
      series,
    };
  };

  useEffect(() => {
    if (timeserie.length === 0) return;
    const ts = timeserie[0].values;
    const tr = { start: ts[0].time, end: ts[ts.length - 1].time };
    setTimeRange(tr);
  }, [timeserie]);

  return (
    <Modal open={open} sx={TSModalStyle}>
      <Grid
        container
        rowSpacing={0}
        columnSpacing={{ xs: 0 }}
        columns={{ xs: 24, def: 24 }}
        sx={TSContainerStyle}
      >
        <Grid xs={1} />
        <Grid xs={22}>
          <Typography variant={'h6'} sx={TitleTSStyle}>
            {t('app.header.timeseries')}
          </Typography>
        </Grid>
        <Grid xs={1} sx={CloseIconContStyle}>
          <IconButton
            color={'secondary'}
            aria-label={t('app.common.close')}
            component={'label'}
            onClick={() => setOpen(false)}
          >
            <ExitIcon fontSize={'large'} />
          </IconButton>
        </Grid>
        <Grid xs={1} />
        <Grid xs={22}>
          {latLng && (
            <TSDataContainer
              latLng={latLng}
              setIds={setIds}
              mode={mode}
              map_data={map_data}
              setTimeRange={setTimeRange}
              place={place}
              setToDownload={setToDownload}
              setFilters={setFilters}
              currentLayer={currentLayer}
              currentMap={currentMap}
              setSeriesFilter={setSeriesFilter}
              setFilledSeries={setFilledSeries}
            />
          )}
        </Grid>
        <Grid xs={1} />
        <DownloadForm
          setOpen={setOpen}
          latLng={latLng}
          ids={ids}
          timeRange={timeRange}
          data={data}
          filter={filter}
          filledSeries={filledSeries}
        />
      </Grid>
    </Modal>
  );
};

export default TimeSeriesDialog;
