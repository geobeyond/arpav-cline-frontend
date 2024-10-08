import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  Box,
  Toolbar,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SnowIcon from '@mui/icons-material/AcUnit';
import MenuIcon from '@mui/icons-material/Menu';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import { MultiRadioSelect } from '../MultiRadioSelect';

import {
  FirstRowStyle,
  GridContainerStyle,
  LeftSpaceStyle,
  MapMenuBarStyle,
  SecondRowStyle,
  SelectStyle,
  LeftSelectStyle,
  SelectMenuStyle,
  ButtonBoxStyle,
  MenuLabelStyle,
  MenuFormControlStyle,
  MenuR1Style,
  MenuR2Style,
} from './styles';
import { MapState } from '../../pages/MapPage/slice/types';
import DownloadDataDialog from '../DownloadDataDialog';
import { useEffect, useState } from 'react';
import { useMapSlice } from '../../pages/MapPage/slice';
import { MenuSelectionMobileStyle } from './styles';
import SnowSunIcon from '../../icons/SnowSunIcon';
import {
  DropdownMenu,
  DropdownToggle,
  LinkList,
  LinkListItem,
} from 'design-react-kit';

export interface MapMenuBar {
  onDownloadMapImg?: Function;
  onMenuChange?: Function;
  mode: string;
  data: string;
  menus: any;
  combinations: any;
  current_map?: any;
  foundLayers?: number;
}

const MAP_MODES = {
  future: 'Proiezioni',
  past: 'Dati Storici',
  advanced: 'Vista avanzata',
  simple: 'Vista semplificata',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export function MapMenuBar(props: MapMenuBar) {
  const map_mode = props.mode;
  const onMenuChange = props.onMenuChange;
  const map_data = props.data;
  const current_map = props.current_map;
  const forecast_parameters = props.menus;
  const foundLayers = props.foundLayers;
  const combinations = (props.combinations || []).reduce(
    (prev, cur) => ({
      ...prev,
      [cur.variable + '::' + cur.aggregation_period + '::' + cur.measure]: cur,
    }),
    {},
  );

  const [activeCombinations, setActiveCombinations] = useState<any>({});

  const onDownloadMapImg = props.onDownloadMapImg ?? (() => { });
  //const {
  //  selected_map,
  //  forecast_parameters,
  //  selectactable_parameters,
  //  timeserie,
  //  // @ts-ignore
  //} = useSelector(state => state?.map as MapState);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const actions = useMapSlice();

  const mapParameters = (mapKey, parameterListKey) => {
    if (forecast_parameters) {
      const fp = forecast_parameters.filter(x => x.name === mapKey)[0];
      const items = fp.allowed_values.map(item => {
        return {
          ...item,
          disabled: false,
          selected: false, //currentMap[mapKey] === item.name,
        };
      });
      //const needsSelection =
      //  selected_map[mapKey] == null &&
      //  items.filter(x => x.disabled === false).length > 0;
      //return { items, needsSelection };
      return { items, needsSelection: false };
    } else {
      return { items: [], needsSelection: false };
    }
  };

  const setItemMenus = () => ({
    variableMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'climatological_variable',
            groupName: '',
            ...mapParameters(
              'climatological_variable',
              'climatological_variable',
            ),
            disableable: false,
          },
        ],
      },
    ],
    modelAndScenarioMenuSet:
      map_data === 'past'
        ? []
        : [
          // COLUMNS:
          {
            rows: [
              {
                key: 'climatological_model',
                groupName: t('app.map.menu.models'),
                ...mapParameters(
                  'climatological_model',
                  'climatological_model',
                ),
                disableable: false,
              },
            ],
          },
          {
            rows: [
              {
                key: 'scenario',
                disableable: false,
                groupName: t('app.map.menu.scenarios'),
                ...mapParameters('scenario', 'scenario'),
              },
            ],
          },
        ],
    periodMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'aggregation_period',
            groupName: t('app.map.menu.dataSeries'),
            ...mapParameters('aggregation_period', 'aggregation_period'),
            disableable: false,
          },
          {
            key: 'measure',
            groupName: t('app.map.menu.valueTypes'),
            ...mapParameters('measure', 'measure'),
            disableable: false,
          },
          {
            key: 'time_window',
            groupName: t('app.map.menu.timeWindows'),
            ...mapParameters('time_window', 'time_window'),
            disableable: true,
          },
        ],
      },
    ],
    seasonMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'year_period',
            groupName: '',
            ...mapParameters('year_period', 'year_period'),
          },
        ],
      },
    ],
  });

  const [menus, setMenus] = useState(setItemMenus());

  useEffect(() => {
    // console.log('PASSO')
    setMenus(setItemMenus());
  }, [forecast_parameters, setItemMenus]);

  // const [selectedValues, setSelectedValues] = React.useState<IGrpItm[][] | []>(
  //   [],
  // );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  // const actualState = useSelector(state => state);
  //@ts-ignore
  // const forecastParams = actualState?.map?.forecast_parameters;

  const [isDownloadDataOpen, setDownloadDataOpen] =
    React.useState<boolean>(false);

  /* ********************************************************************************************************** */
  // MENU 0
  /* ********************************************************************************************************** */

  // const handleChange = (menuIdx: number, groupSelection: IGrpItm[]) => {
  const handleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);
    console.log(combinations);
    if (
      ['climatological_variable', 'aggregation_period', 'measure'].indexOf(
        key,
      ) >= 0
    ) {
      let ckey = '{climatological_variable}::{aggregation_period}::{measure}';
      ckey = ckey.replace('{' + key + '}', value);
      ckey = ckey.replace(
        '{climatological_variable}',
        current_map.climatological_variable,
      );
      ckey = ckey.replace(
        '{aggregation_period}',
        current_map.aggregation_period,
      );
      ckey = ckey.replace('{measure}', current_map.measure);
      if (Object.keys(combinations).indexOf(ckey) >= 0) {
        setActiveCombinations(combinations[ckey]);
      }
    }
    if (onMenuChange) {
      onMenuChange({ key, value });
    }
  };

  const findValueName = (key: string, listKey: string) => {
    return '';
  };

  const hasMissingValues = items => {
    return (
      items.filter(h => h.rows.filter(x => x.needsSelection).length > 0)
        .length > 0
    );
  };

  return (
    <FormControl sx={MenuFormControlStyle}>
      <Toolbar disableGutters sx={MapMenuBarStyle}>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={{ xs: 0 }}
          columns={{ xs: 7, def: 21 }}
          sx={GridContainerStyle}
        >
          {isMobile ? (
            <></>
          ) : (
            <>
              <Grid xs={4} sx={FirstRowStyle}>
                <Box sx={LeftSpaceStyle}>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.indicator')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={4} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.model')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={4} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.period')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={4} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.season')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={4} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {MAP_MODES[map_data]} - {MAP_MODES[map_mode]}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={1} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>{foundLayers}</Typography>
                </Box>
              </Grid>
            </>
          )}
          <Grid xs={1} def={4} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.variableMenuSet}
              current_map={current_map}
              onChange={handleChange}
              sx={LeftSelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<ThermostatIcon />}
              label={t('app.map.menuBar.indicator')}
              disableable={false}
            />
          </Grid>
          <Grid xs={1} def={4} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.modelAndScenarioMenuSet}
              current_map={current_map}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<ShowChartIcon />}
              activeCombinations={[
                ...(activeCombinations?.other_parameters
                  ?.climatological_model || []),
                ...(activeCombinations?.other_parameters?.scenario || []),
              ]}
              className={
                hasMissingValues(menus.modelAndScenarioMenuSet)
                  ? 'NeedsSelection'
                  : ''
              }
              // label={'Model and Scenario'}
              label={t('app.map.menuBar.model')}
            />
          </Grid>
          <Grid xs={1} def={4} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.periodMenuSet}
              current_map={current_map}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<DateRangeIcon />}
              activeCombinations={
                activeCombinations?.other_parameters?.time_window
              }
              className={
                hasMissingValues(menus.periodMenuSet) ? 'NeedsSelection' : ''
              }
              // label={'Period'}
              label={t('app.map.menuBar.period')}
            />
          </Grid>
          <Grid xs={1} def={4} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.seasonMenuSet}
              current_map={current_map}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<SnowSunIcon />}
              className={
                hasMissingValues(menus.seasonMenuSet) ? 'NeedsSelection' : ''
              }
              label={t('app.map.menuBar.season')}
            // label={'Season'}
            />
          </Grid>
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              {isMobile ? (
                <IconButton
                  onClick={() => setDownloadDataOpen(true)}
                  disabled={true}
                  aria-label={t('app.map.menuBar.downloadData')}
                >
                  <FileDownloadIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<FileDownloadIcon />}
                  onClick={() => setDownloadDataOpen(true)}
                  aria-label={t('app.map.menuBar.downloadData')}
                >
                  {t('app.map.menuBar.downloadData')}
                </Button>
              )}
              <DownloadDataDialog
                menus={forecast_parameters}
                open={isDownloadDataOpen}
                setOpen={setDownloadDataOpen}
                configuration={current_map}
              />
            </Box>
          </Grid>
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              {isMobile ? (
                <IconButton
                  onClick={() => onDownloadMapImg()}
                  aria-label={t('app.map.menuBar.downloadMap')}
                >
                  <PhotoCameraIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => onDownloadMapImg()}
                  aria-label={t('app.map.menuBar.downloadMap')}
                >
                  {t('app.map.menuBar.downloadMap')}
                </Button>
              )}
            </Box>
          </Grid>
          <Grid xs={1} def={1} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              <DropdownToggle>
                <MenuIcon />
              </DropdownToggle>
              <DropdownMenu style={{ zIndex: 100000000 }}>
                <LinkList>
                  <LinkListItem inDropdown href="/">
                    Home
                  </LinkListItem>
                  <LinkListItem inDropdown href="/barometer">
                    Barometro Climatico
                  </LinkListItem>
                  <LinkListItem divider />
                  <LinkListItem header inDropdown>
                    Proiezioni
                  </LinkListItem>
                  <LinkListItem inDropdown href="/fs">
                    Proiezioni - Semplificata
                  </LinkListItem>
                  <LinkListItem inDropdown href="/fa">
                    Proiezioni - Avanzata
                  </LinkListItem>
                  <LinkListItem divider />
                  <LinkListItem header inDropdown>
                    Dati storici
                  </LinkListItem>
                  <LinkListItem inDropdown href="/ps">
                    Storico - Semplificata
                  </LinkListItem>
                  <LinkListItem inDropdown href="/pa">
                    Storico - Avanzata
                  </LinkListItem>
                </LinkList>
              </DropdownMenu>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
      {isMobile && (
        <Toolbar sx={MenuSelectionMobileStyle}>
          <Typography variant={'caption'}></Typography>
        </Toolbar>
      )}
    </FormControl>
  );
}

export default MapMenuBar;
