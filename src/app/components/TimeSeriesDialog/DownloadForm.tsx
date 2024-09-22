import Grid from '@mui/material/Unstable_Grid2';
import UserDlData from '../UserDlData/userDlData';
import {
  CloseButtonContStyle,
  DLButtonContStyle,
  FormTitleTextStyle,
} from './styles';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestApi } from '../../Services';
import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';
import { useMapSlice } from '../../pages/MapPage/slice';

import PapaParse from 'papaparse';
import JSZip from 'jszip';

export const DownloadForm = props => {
  const { setOpen, latLng, ids, timeRange, data, filter } = props;
  const { t } = useTranslation();
  const api = RequestApi.getInstance();
  const dispatch = useDispatch();
  const actions = useMapSlice();

  const [loader, setLoader] = React.useState(false);

  const [downloadDisabled, setDownloadDisabled] = React.useState(true);
  const userValidityHandleChange = (isValid: boolean) => {
    setDownloadDisabled(!isValid);
  };

  const [userData, setUserData] = useState<any>({
    accept_disclaimer: false,
    email: '',
    membership: '',
    name: '',
    public: false,
  });

  const handleChange = values => {
    setUserData({ ...userData, ...values });
  };

  const download = () => {
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
      start: timeRange?.current?.start,
      end: timeRange?.current?.end,
      fitms: filter.current,
    };
    setLoader(true);
    let fdata: any[] = [];
    fdata.push(
      ...data.current.series.filter(
        x =>
          !('uncertainty_type' in x.info) &&
          [
            filterParams.fitms.mainModel,
            filterParams.fitms.secondaryModel,
          ].indexOf(x.info.climatological_model) >= 0 &&
          x.info.processing_method.indexOf(filterParams.fitms.tsSmoothing) >= 0,
      ),
    );
    if (filterParams.fitms.uncertainty) {
      fdata.push(
        ...data.current.series.filter(
          x =>
            'uncertainty_type' in x.info &&
            [
              filterParams.fitms.mainModel,
              filterParams.fitms.secondaryModel,
            ].indexOf(x.info.climatological_model) >= 0 &&
            x.info.processing_method.indexOf(filterParams.fitms.tsSmoothing) >=
            0,
        ),
      );
    }

    fdata.push(
      ...data.current.series.filter(x => 'series_elaboration' in x.info),
    );
    let z = new JSZip();
    for (let f in fdata) {
      const ffdata = fdata[f] as any;
      console.log(fdata[f]);
      const pu = PapaParse.unparse(
        ffdata.values.slice(filterParams.start, filterParams.end + 1),
      );
      z.file(ffdata.name + '.csv', pu);
    }
    z.generateAsync({ type: 'blob' }).then(function (content) {
      // see FileSaver.js
      saveAs(content, 'out.zip');
    });

    console.log(fdata, filterParams);
    setLoader(false);
  };

  const downloadJson = () => {
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
      start: timeRange?.current?.start,
      end: timeRange?.current?.end,
      fitms: filter.current,
    };
    setLoader(true);
    let fdata: any[] = [];
    fdata.push(
      ...data.current.series.filter(
        x =>
          !('uncertainty_type' in x.info) &&
          [
            filterParams.fitms.mainModel,
            filterParams.fitms.secondaryModel,
          ].indexOf(x.info.climatological_model) >= 0 &&
          x.info.processing_method.indexOf(filterParams.fitms.tsSmoothing) >= 0,
      ),
    );
    if (filterParams.fitms.uncertainty) {
      fdata.push(
        ...data.current.series.filter(
          x =>
            'uncertainty_type' in x.info &&
            [
              filterParams.fitms.mainModel,
              filterParams.fitms.secondaryModel,
            ].indexOf(x.info.climatological_model) >= 0 &&
            x.info.processing_method.indexOf(filterParams.fitms.tsSmoothing) >=
            0,
        ),
      );
    }

    fdata.push(
      ...data.current.series.filter(x => 'series_elaboration' in x.info),
    );
    let z = new JSZip();
    for (let f in fdata) {
      const ffdata = fdata[f] as any;
      console.log(fdata[f]);
      ffdata.values = ffdata.values.slice(
        filterParams.start,
        filterParams.end + 1,
      );
      z.file(ffdata.name + '.json', JSON.stringify(ffdata));
    }
    z.generateAsync({ type: 'blob' }).then(function (content) {
      // see FileSaver.js
      saveAs(content, 'out.zip');
    });

    console.log(fdata, filterParams);
    setLoader(false);
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
          disabled={downloadDisabled || loader || !ids.current?.length}
          color={'primary'}
          variant={'contained'}
          startIcon={
            loader ? <CircularProgress size={20} /> : <FileDownloadIcon />
          }
          onClick={download}
        >
          {t('app.map.timeSeriesDialog.DLCsv')}
        </Button>
        <Button
          disabled={downloadDisabled || loader || !ids.current?.length}
          color={'primary'}
          variant={'contained'}
          startIcon={
            loader ? <CircularProgress size={20} /> : <FileDownloadIcon />
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
