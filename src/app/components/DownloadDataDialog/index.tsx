import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  IconButton,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  FormControl,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ExitIcon from '@mui/icons-material/HighlightOff';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTranslation } from 'react-i18next';
import {
  CloseButtonContStyle,
  CloseIconContStyle,
  DLButtonContStyle,
  DownloadContainerStyle,
  DownloadModalStyle,
  MapUserContainerStyle,
  ModalStyle,
  TitleDownloadStyle,
} from './styles';
import MapDlData from './mapDlData';
import UserDlData from '../UserDlData/userDlData';
import { saveAs } from 'file-saver';
import { useMapSlice } from '../../pages/MapPage/slice';
import { API_URL } from '../../../utils/constants';
import { RequestApi } from 'app/Services/API/Requests';

export interface DownloadDataDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  configuration: any;
  menus: any;
  combinations: any;
}

const DownloadDataDialog = (props: DownloadDataDialogProps) => {
  const { open, setOpen, configuration, menus, combinations } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const actions = useMapSlice();

  const api = RequestApi.getInstance();

  const dataSet = React.useRef<any>({});
  const [downloadDisabled, setDownloadDisabled] = React.useState(true);

  const [loader, setLoader] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState('');

  const [showLinks, setShowLinks] = React.useState(false);
  const [links, setLinks] = React.useState([]);

  const [activeConfiguration, setActiveConfiguration] =
    React.useState(configuration);

  //@ts-ignore
  const { selected_map } = useSelector(state => state?.map as MapState);

  const userValidityHandleChange = (isValid: boolean) => {
    setDownloadDisabled(!isValid);
  };

  const setList = links => {
    setLinks(links);
    setShowLinks(true);
  };

  const getLinks = configuration => {
    api.getForecastData(configuration, dataSet.current).then((finds: any) => {
      setList(finds);
    });
  };

  const [downloads, setDownloads] = React.useState([]);

  const handleChange = values => {
    dataSet.current = { ...dataSet.current, ...values };
    const params = {
      id: parseInt(selected_map.id),
      ...dataSet.current,
      ...values,
    };
    const url = `${API_URL}/maps/ncss/netcdf/?${new URLSearchParams(
      params,
    ).toString()}`;
    setDownloadUrl(url);
  };

  return (
    <>
      <Modal open={open} sx={DownloadModalStyle}>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={{ xs: 0 }}
          columns={{ xs: 28, def: 28 }}
          sx={DownloadContainerStyle}
        >
          <Grid xs={1}></Grid>
          <Grid xs={26}>
            <Typography variant={'h6'} sx={TitleDownloadStyle}>
              {t('app.header.acronymMeaning')} - Modulo scarica dati
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
          <Grid xs={1}></Grid>
          <Grid xs={26}>
            <Grid
              container
              rowSpacing={0}
              columnSpacing={{ xs: 0 }}
              columns={{ xs: 26, def: 26 }}
              sx={MapUserContainerStyle}
            >
              <Grid xs={26}>
                <MapDlData
                  menus={menus}
                  onChange={handleChange}
                  configuration={activeConfiguration}
                  combinations={combinations}
                  setActive={setActiveConfiguration}
                />
              </Grid>
              <Grid xs={26}>
                <UserDlData
                  onChange={handleChange}
                  onValidityChange={userValidityHandleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={1}></Grid>
          <Grid xs={0} def={1}></Grid>
          <Grid xs={28} def={11} sx={DLButtonContStyle}>
            <Button
              color={'primary'}
              variant={'contained'}
              disabled={downloadDisabled || loader}
              onClick={() => {
                getLinks(activeConfiguration);
              }}
            >
              {t('app.map.downloadDataDialog.DLNetCDF')}
            </Button>
          </Grid>
          <Grid xs={28} def={11} sx={CloseButtonContStyle}>
            <Button
              variant={'contained'}
              color={'secondary'}
              onClick={() => setOpen(false)}
            >
              {t('app.common.close')}
            </Button>
          </Grid>
          <Grid xs={0} def={1}></Grid>
          <Grid xs={10} def={10} xsOffset={1} defOffset={1}>
            <Modal open={showLinks} sx={ModalStyle} onClose={() => setShowLinks(false)}>
              <Box>
                <Typography variant={'h6'}>Estrazioni scaricabili</Typography>
                <List dense={true}>
                  {links.map((x: any) => (
                    <ListItem disablePadding>
                      <ListItemButton href={x.url}>
                        <ListItemText primary={x.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default DownloadDataDialog;
