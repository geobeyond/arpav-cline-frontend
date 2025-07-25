import Grid from '@mui/material/Unstable_Grid2';
import UserDlData from '../UserDlData/userDlData';
import {
  CloseButtonContStyle,
  DLButtonContStyle,
  FormTitleTextStyle,
} from './styles';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestApi } from '../../Services';
import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';
import { useMapSlice } from '../../pages/MapPage/slice';

import PapaParse from 'papaparse';
import JSZip from 'jszip';

export const DownloadForm = props => {
  const { setOpen, latLng, ids, timeRange, data, filter, filledSeries, mode } =
    props;
  const { t } = useTranslation();
  const api = RequestApi.getInstance();
  const dispatch = useDispatch();
  const actions = useMapSlice();

  const [jsonLoader, setJsonLoader] = React.useState(false);
  const [csvLoader, setCsvLoader] = React.useState(false);
  const [seriesObject, setSeriesObject] = React.useState<any>({});

  const [downloadDisabled, setDownloadDisabled] = React.useState(true);
  const userValidityHandleChange = (isValid: boolean) => {
    setDownloadDisabled(!isValid);
  };

  class UserData {
    accept_disclaimer?: boolean;
    email?: string;
    membership?: string;
    name?: string;
    public?: boolean;
    coords?: string
  }

  const [userData, setUserData] = useState<UserData>({
    accept_disclaimer: false,
    email: '',
    membership: '',
    name: '',
    public: false,
    coords: ""
  });

  const handleChange = values => {
    setUserData({ ...userData, ...values });
  };

  const pushUserData = () => {
    api.pushUserData(data.current.series[0].info.coverage_identifier, {...userData, ...{coords: data.current.series[0].info.location}});
  };

  const refreshSeriesObject =
    mode === 'forecast' && data.current.series
      ? async () => {
        let opseriesObj = [
          filter.current.uncertainty
            ? data.current.series.filter(
              x =>
                x.info.scenario === 'rcp26' &&
                x.info.climatological_model === filter.current.mainModel &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.dataset_type === 'forecast_lower_uncertainty',
            )[0]
            : null,
          data.current.series.filter(
            x =>
              x.info.scenario === 'rcp26' &&
              x.info.processing_method === filter.current.tsSmoothing &&
              x.info.climatological_model === filter.current.mainModel &&
              x.info.dataset_type === 'main',
          )[0],
          filter.current.mainModel === filter.current.secondaryModel
            ? null
            : data.current.series.filter(
              x =>
                x.info.scenario === 'rcp26' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model ===
                filter.current.secondaryModel &&
                x.info.dataset_type === 'main',
            )[0],
          filter.current.uncertainty
            ? data.current.series.filter(
              x =>
                x.info.scenario === 'rcp26' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model === filter.current.mainModel &&
                x.info.dataset_type === 'forecast_upper_uncertainty',
            )[0]
            : null,
          filter.current.uncertainty
            ? data.current.series.filter(
              x =>
                x.info.scenario === 'rcp45' &&
                x.info.climatological_model === filter.current.mainModel &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.dataset_type === 'forecast_lower_uncertainty',
            )[0]
            : null,
          data.current.series.filter(
            x =>
              x.info.scenario === 'rcp45' &&
              x.info.processing_method === filter.current.tsSmoothing &&
              x.info.climatological_model === filter.current.mainModel &&
              x.info.dataset_type === 'main',
          )[0],
          filter.current.mainModel === filter.current.secondaryModel
            ? null
            : data.current.series.filter(
              x =>
                x.info.scenario === 'rcp45' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model ===
                filter.current.secondaryModel &&
                x.info.dataset_type === 'main',
            )[0],
          filter.current.uncertainty
            ? data.current.series.filter(
              x =>
                x.info.scenario === 'rcp45' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model === filter.current.mainModel &&
                x.info.dataset_type === 'forecast_upper_uncertainty',
            )[0]
            : null,
          filter.current.uncertainty
            ? data.current.series.filter(
              x =>
                x.info.scenario === 'rcp85' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model === filter.current.mainModel &&
                x.info.dataset_type === 'forecast_lower_uncertainty',
            )[0]
            : null,
          data.current.series.filter(
            x =>
              x.info.scenario === 'rcp85' &&
              x.info.processing_method === filter.current.tsSmoothing &&
              x.info.climatological_model === filter.current.mainModel &&
              x.info.dataset_type === 'main',
          )[0],
          filter.current.mainModel === filter.current.secondaryModel
            ? null
            : data.current.series.filter(
              x =>
                x.info.scenario === 'rcp85' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model ===
                filter.current.secondaryModel &&
                x.info.dataset_type === 'main',
            )[0],
          filter.current.uncertainty
            ? data.current.series.filter(
              x =>
                x.info.scenario === 'rcp85' &&
                x.info.processing_method === filter.current.tsSmoothing &&
                x.info.climatological_model === filter.current.mainModel &&
                x.info.dataset_type === 'forecast_upper_uncertainty',
            )[0]
            : null,
          data.current.series.filter(
            x =>
              x.info.dataset_type === 'observation' &&
              x.info.processing_method === filter.current.sensorSmoothing,
          )[0],
        ];

        await setSeriesObject(opseriesObj);
        return opseriesObj;
      }
      : async () => {
        if (data.current.series?.length > 0) {
          let tdata: any[] = data.current.series;
          let opseriesObj = [
            tdata.filter(
              x =>
                x.info.processing_method.indexOf(filter.current.mainModel) >=
                0,
            )[0],
            tdata.filter(
              x => x.info.processing_method === 'decade_aggregation',
            )[0],
            tdata.filter(
              x => x.info.processing_method === 'mann_kendall_trend',
            )[0],
          ];

          await setSeriesObject(opseriesObj);
          return opseriesObj;
        }
      };

  useEffect(() => {
    refreshSeriesObject();
  }, [filter.current, data.current]);

  const download = async () => {
    pushUserData();
    const seriesObj = await refreshSeriesObject();
    console.log(seriesObject);
    console.log('download');
    if (!latLng || !ids) {
      console.log(latLng, ids);
      return;
    }
    const filterParams = {
      ...userData,
      ids: ids.current,
      latitude: latLng.lat,
      longitude: latLng.lng,
      start: timeRange?.current?.start || 0,
      end: timeRange?.current?.end || 124,
      fitms: filter,
      sfs: filter.current?.series?.flat(),
    };
    setCsvLoader(true);
    //@ts-ignore
    let fdata = [...seriesObj];

    let z = new JSZip();
    for (let f in fdata) {
      if (fdata[f]) {
        const ffdata = fdata[f] as any;
        if (
          filterParams.sfs === undefined ||
          filterParams.sfs.indexOf(ffdata.name) >= 0
        ) {
          ffdata.values = filledSeries.current[ffdata.name];
          console.log(fdata[f]);
          const pu = PapaParse.unparse(
            ffdata.values.slice(filterParams.start, filterParams.end + 1),
          );
          z.file(ffdata.name + '.csv', pu);
        }
      }
    }
    z.generateAsync({ type: 'blob' }).then(function (content) {
      // see FileSaver.js
      saveAs(content, 'out.zip');
    });

    console.log(fdata, filterParams);
    setCsvLoader(false);
  };

  const downloadJson = () => {
    pushUserData();
    refreshSeriesObject();
    console.log('download');
    if (!latLng || !ids) {
      console.log(latLng, ids);
      return;
    }
    const filterParams = {
      ...userData,
      ids: ids.current,
      latitude: latLng.lat,
      longitude: latLng.lng,
      start: timeRange?.current?.start || 0,
      end: timeRange?.current?.end || 124,
      fitms: filter,
      sfs: filter.current?.series?.flat(),
    };
    setJsonLoader(true);
    let fdata = [...seriesObject];

    let z = new JSZip();
    for (let f in fdata) {
      if (fdata[f]) {
        const ffdata = fdata[f] as any;
        console.log(fdata[f]);
        if (
          filterParams.sfs === undefined ||
          filterParams.sfs.indexOf(ffdata.name) >= 0
        ) {
          ffdata.values = filledSeries.current[ffdata.name];
          ffdata.values = ffdata.values.slice(
            filterParams.start,
            filterParams.end + 1,
          );
          z.file(ffdata.name + '.json', JSON.stringify(ffdata));
        }
      }
    }
    z.generateAsync({ type: 'blob' }).then(function (content) {
      // see FileSaver.js
      saveAs(content, 'out.zip');
    });

    console.log(fdata, filterParams);
    setJsonLoader(false);
  };

  return (
    <>
      <Grid xs={1} />
      <Grid xs={22}>
        {latLng && (
          <Box>
            <Typography variant={'h6'} align={'center'} sx={FormTitleTextStyle}>
              {t('app.map.timeSeriesDialog.DLTimeSeries')}
            </Typography>
            <UserDlData
              mode={mode}
              onChange={handleChange}
              onValidityChange={userValidityHandleChange}
            />
          </Box>
        )}
      </Grid>
      <Grid xs={1} />
      <Grid xs={0} def={1} />
      <Grid xs={24} def={11} sx={DLButtonContStyle}>
        <Button
          disabled={downloadDisabled || csvLoader || !ids.current?.length}
          color={'primary'}
          variant={'contained'}
          startIcon={
            csvLoader ? <CircularProgress size={20} /> : <FileDownloadIcon />
          }
          onClick={download}
        >
          {t('app.map.timeSeriesDialog.DLCsv')}
        </Button>
        <Button
          disabled={downloadDisabled || jsonLoader || !ids.current?.length}
          color={'primary'}
          variant={'contained'}
          startIcon={
            jsonLoader ? <CircularProgress size={20} /> : <FileDownloadIcon />
          }
          onClick={downloadJson}
        >
          {t('app.map.timeSeriesDialog.DLJson')}
        </Button>
      </Grid>
      <Grid xs={24} def={11} sx={CloseButtonContStyle}>
        <Button
          variant={'contained'}
          color={'secondary'}
          onClick={() => setOpen(false)}
        >
          {t('app.common.close')}
        </Button>
      </Grid>
      <Grid xs={0} def={1} />
    </>
  );
};
