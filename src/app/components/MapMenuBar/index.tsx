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
  Tooltip,
  CircularProgress,
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
import DownloadDataDialog from '../DownloadDataDialog';
import { useEffect, useState, useRef } from 'react';
import { useMapSlice } from '../../pages/MapPage/slice';
import { MenuSelectionMobileStyle } from './styles';
import SnowSunIcon from '../../icons/SnowSunIcon';
import {
  DropdownMenu,
  DropdownToggle,
  LinkList,
  LinkListItem,
} from 'design-react-kit';
import { RequestApi } from 'app/Services';

export interface MapMenuBar {
  onDownloadMapImg?: Function;
  onMenuChange?: Function;
  mode: string;
  data: string;
  menus: any;
  combinations: any;
  current_map?: any;
  foundLayers: number;
  setCurrentMap: Function;
  openError: Function;
  showLoader?: Function;

  inProgress?: boolean;
}

const MAP_MODES = {
  forecast: 'Proiezioni',
  past: 'Storico',
  advanced: 'Avanzata',
  simple: 'Semplice',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export function MapMenuBar(props: MapMenuBar) {
  const map_mode = props.mode;
  const map_data = props.data;
  const onMenuChange = props.onMenuChange;
  const current_map = props.current_map;
  const forecast_parameters = props.menus;
  const foundLayers = props.foundLayers;
  const setCurrentMap = props.setCurrentMap;
  const combinations = props.combinations || {};
  const openError = props.openError;
  const showLoader = props.showLoader;
  const inProgress = props.inProgress || false;

  const activeCombinations = useRef(
    Object.keys(combinations).length > 0
      ? combinations['tas::thirty_year']
      : {},
  );

  const setActiveCombinations = combo => {
    activeCombinations.current = { ...combo };
  };

  const onDownloadMapImg = props.onDownloadMapImg ?? (() => { });
  //const {
  //  selected_map,
  //  forecast_parameters,
  //  selectactable_parameters,
  //  timeserie,
  //  // @ts-ignore
  //} = useSelector(state => state?.map as MapState);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const actions = useMapSlice();
  const localCM = useRef<any>(current_map);

  const changingParameter = useRef<string>('climatological_variable');
  const changingValue = useRef<string>('tas');
  const prevValue = useRef<string | null>('tas');
  const showModal = useRef<boolean>(true);

  const api = RequestApi.getInstance();

  const mapParameters = (mapKey, parameterListKey) => {
    if (forecast_parameters) {
      const fp = forecast_parameters.filter(x => x.name === mapKey)[0];
      const items = fp.allowed_values?.map(item => {
        //TODO: Controllre caso in cui fp sia vuoto
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
            criteria: (x, c) => [],
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
                criteria: (x, c) => [],
                disabled: x => false,
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
                criteria: (x, c) => [],
                disabled: x => false,
              },
            ],
          },
        ],
    periodMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key:
              map_data === 'forecast'
                ? 'aggregation_period'
                : 'aggregation_period',
            groupName: t('app.map.menu.dataSeries'),
            ...mapParameters('aggregation_period', 'aggregation_period'),
            disableable: true,
            disabled: x => false,
            criteria: (x, c) => {
              return x?.aggregation_period;
            },
          },
          {
            key: 'measure',
            groupName: t('app.map.menu.valueTypes'),
            ...mapParameters('measure', 'measure'),
            disableable: true,
            disabled: x => false,
            criteria: (x, c) => x?.measure,
          },
          {
            key: map_data === 'forecast' ? 'time_window' : 'reference_period',
            groupName: t('app.map.menu.timeWindows'),
            ...mapParameters(
              map_data === 'forecast' ? 'time_window' : 'reference_period',
              map_data === 'forecast' ? 'time_window' : 'reference_period',
            ),
            disableable: true,
            disabled: x => x.aggregation_period !== 'thirty_year',
            criteria: (x, c) =>
              c.aggregation_period !== 'thirty_year' ? [] : ['tw1', 'tw2'],
          },
        ],
      },
    ],
    seasonMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            multicol: [5, 11, 17],
            multicol_size: [160, 120, 120],
            key: 'year_period',
            groupName: '',
            ...mapParameters('year_period', 'year_period'),
            disableable: true,
            disabled: x => false,
            criteria: (x, c) => x?.year_period || x?.year_period,
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

  useEffect(() => {

  }, [isDownloadDataOpen])

  const all_meas = ['absolute', 'anomaly'];
  const all_pers = ['annual', 'thirty_year'];
  const all_indx = [
    'tas',
    'cdds',
    'hdds',
    'pr',
    'snwdays',
    'su30',
    'tasmax',
    'tasmin',
    'tr',
    'fd',
  ];

  const changeables = ['measure', 'year_period', 'time_window'];
  /* ********************************************************************************************************** */
  // MENU 0
  /* ********************************************************************************************************** */

  const toDefault = object => {
    let ret: any = {};
    for (let k of Object.keys(object)) {
      if (object[k].length > 0) {
        ret[k] = object[k][object[k].length - 1];
      } else {
        ret[k] = null;
      }
    }

    ret.climatological_model = 'model_ensemble';
    ret.scenario = 'rcp85';
    ret.aggregation_period = 'thirty_year';
    ret.measure = 'anomaly';
    ret.time_window = 'tw1';

    return ret;
  };

  const handleChange = (key: string, value: string) => {
    if (showLoader) {
      if (onMenuChange) {
        onMenuChange(true);
      }
    }
    prevValue.current = localCM.current[key];
    changingParameter.current = key;
    changingValue.current = value;
    localCM.current = { ...localCM.current, ...{ [key]: value } };
    if (key === 'climatological_variable') {
      showModal.current = false;
      console.log('activatingCV', value, combinations[value]);
      setActiveCombinations(combinations[value]);
      localCM.current = toDefault(combinations[value + '::30yr']);
      setCurrentMap(localCM.current);
    } else {
      const steps = [
        'climatological_variable',
        'aggregation_period',
        'measure',
      ];
      console.log('handleChange', key, value);
      console.log(combinations);
      const idx = steps.indexOf(key);
      let ckey = '{climatological_variable}';
      if (idx > 0) {
        ckey = ckey + '::{metric}';
        ckey = ckey.replace(
          '{climatological_variable}',
          current_map.climatological_variable,
        );
        ckey = ckey.replace('{metric}', value);
        if (Object.keys(combinations).indexOf(ckey) >= 0) {
          //if (current_map[key] in combinations[ckey]) {
          console.log(
            'activating Combo',
            ckey,
            combinations[ckey][current_map[key]],
          );
          setActiveCombinations(combinations[ckey]);
          //}
        } else if (
          Object.keys(combinations).indexOf(
            current_map.climatological_variable,
          ) >= 0
        ) {
          setActiveCombinations(
            combinations[current_map.climatological_variable],
          );
        }
      }
      setCurrentMap(localCM.current);
    }
    if (onMenuChange) {
      onMenuChange(true);
    }
  };

  //setActiveCombinations(combinations['tas']);

  const findValueName = (key: string, listKey: string) => {
    return '';
  };

  const hasMissingValues = items => {
    return (
      items.filter(h => h.rows.filter(x => x.needsSelection).length > 0)
        .length > 0
    );
  };

  useEffect(() => {
    if (foundLayers === 0) {
      if (changingParameter.current !== 'climatological_variable') {
        openError('wrong_config');
      }
      let nm = { ...localCM.current };

      if (changingParameter.current === 'year_period') {
        if (prevValue.current) {
          nm.year_period = prevValue.current;
          prevValue.current = null;
        }
      } else {
        let kk = localCM.current.climatological_variable;

        let pkk = kk + '::' + localCM.current.aggregation_period;
        let mkk = kk + '::' + localCM.current.measure;

        if (kk in combinations) {
          let opts = { ...combinations[kk] };
          if (pkk in combinations) {
            opts = { ...combinations[pkk] };
          } else if (mkk in combinations) {
          }
          console.log(opts);
          if (opts) {
            for (let k of Object.keys(localCM.current)) {
              if (changeables.indexOf(k) >= 0) {
                if (
                  opts[k].indexOf(localCM.current[k]) < 0 ||
                  k.indexOf('measure') >= 0
                ) {
                  if (opts[k].length > 0) {
                    nm[k] = opts[k].filter(x => localCM.current[k] !== x)[0];
                  } else {
                    nm[k] = null;
                  }
                } else {
                  opts[k] = all_meas.filter(gg => gg !== localCM.current[k])[0];
                }
              }
            }
          }
        }
      }
      localCM.current = { ...nm };
      console.log(localCM.current);
      setCurrentMap(localCM.current);

      setActiveCombinations(
        combinations[localCM.current.climatological_variable],
      );
    } else {
      if (onMenuChange) {
        onMenuChange(false);
      }
    }
  }, [foundLayers]);

  const labelFor = (itm: string) => {
    api.getConfigurationParams().then(x => { });
    const confs = localStorage.getItem('configs');
    let configs = [];
    if (confs) {
      configs = JSON.parse(confs);
    }
    const labelsf = configs.map((config: any) =>
      config.allowed_values.map(x => [
        x.name,
        i18n.language === 'it'
          ? x.display_name_italian
          : x.display_name_english,
      ]),
    );
    const labels = Object.fromEntries(labelsf.flat());
    return labels[itm];
  };

  const selectedValueToString = () => {
    const caption = `${labelFor(localCM.current.climatological_variable)}
    - ${labelFor(localCM.current.climatological_model)}
    - ${labelFor(localCM.current.scenario)}
    - ${labelFor(localCM.current.aggregation_period)}
    - ${labelFor(localCM.current.measure)}
    ${localCM.current.time_window &&
        localCM.current.aggregation_period === '30yr'
        ? ' - ' + labelFor(localCM.current.time_window)
        : ''
      }
    - ${labelFor(localCM.current.year_period)}`;
    return caption;
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
              {map_data === 'past' ? (
                <></>
              ) : (
                <Grid xs={4} sx={FirstRowStyle}>
                  <Box>
                    <Typography sx={MenuLabelStyle}>
                      {t('app.map.menuBar.model')}
                    </Typography>
                  </Box>
                </Grid>
              )}
              <Grid xs={4} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.period')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={map_data === 'past' ? 8 : 4} sx={FirstRowStyle}>
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
                  <Typography sx={MenuLabelStyle}></Typography>
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
              disabled={inProgress}
            />
          </Grid>

          {map_data === 'past' ? (
            <></>
          ) : (
            <Grid xs={1} def={4} sx={SecondRowStyle}>
              <MultiRadioSelect
                valueSet={menus.modelAndScenarioMenuSet}
                current_map={current_map}
                onChange={handleChange}
                sx={SelectStyle}
                menuSx={SelectMenuStyle}
                mobileIcon={<ShowChartIcon />}
                className={
                  hasMissingValues(menus.modelAndScenarioMenuSet)
                    ? 'NeedsSelection'
                    : ''
                }
                // label={'Model and Scenario'}
                label={t('app.map.menuBar.model')}
                disabled={inProgress}
              />
            </Grid>
          )}
          <Grid xs={1} def={4} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.periodMenuSet}
              current_map={current_map}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              activeCombinations={activeCombinations.current}
              mobileIcon={<DateRangeIcon />}
              className={
                hasMissingValues(menus.periodMenuSet) ? 'NeedsSelection' : ''
              }
              // label={'Period'}
              label={t('app.map.menuBar.period')}
              disabled={inProgress}
            />
          </Grid>

          {map_data === 'past' ? (
            <Grid xs={2} def={8} sx={SecondRowStyle}>
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
                activeCombinations={activeCombinations.current}
                label={t('app.map.menuBar.season')}
                // label={'Season'}
                disabled={inProgress}
              />
            </Grid>
          ) : (
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
                activeCombinations={activeCombinations.current}
                label={t('app.map.menuBar.season')}
                // label={'Season'}
                disabled={inProgress}
              />
            </Grid>
          )}
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              {isMobile ? (
                <Tooltip
                  title={t('app.map.menuBar.downloadData')}
                  enterTouchDelay={0}
                >
                  <IconButton
                    onClick={() => setDownloadDataOpen(true)}
                    aria-label={t('app.map.menuBar.downloadMap')}
                    disabled={
                      foundLayers === 0 || inProgress || map_mode === 'simple'
                    }
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                /*</Grid><IconButton
                  onClick={() => setDownloadDataOpen(true)}
                  disabled={true}
                  aria-label={t('app.map.menuBar.downloadData')}
                >
                  <FileDownloadIcon />
                </IconButton>*/
                <Button
                  startIcon={<FileDownloadIcon />}
                  onClick={() => setDownloadDataOpen(true)}
                  aria-label={t('app.map.menuBar.downloadData')}
                  disabled={
                    foundLayers === 0 || inProgress || map_mode === 'simple'
                  }
                >
                  {t('app.map.menuBar.downloadData')}
                </Button>
              )}
              <DownloadDataDialog
                menus={forecast_parameters}
                open={isDownloadDataOpen}
                setOpen={setDownloadDataOpen}
                combinations={combinations}
                configuration={current_map}
                mode={map_data}
              />
            </Box>
          </Grid>
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              {isMobile ? (
                <IconButton
                  onClick={() => onDownloadMapImg()}
                  disabled={foundLayers === 0 || inProgress}
                  aria-label={t('app.map.menuBar.downloadMap')}
                >
                  {inProgress ? (
                    <CircularProgress size={20} />
                  ) : (
                    <PhotoCameraIcon />
                  )}
                </IconButton>
              ) : (
                <Button
                  startIcon={
                    inProgress ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PhotoCameraIcon />
                    )
                  }
                  onClick={() => onDownloadMapImg()}
                  aria-label={t('app.map.menuBar.downloadMap')}
                  disabled={foundLayers === 0 || inProgress}
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
                    {t('app.index.sections.barometer')}
                  </LinkListItem>
                  <LinkListItem divider />
                  <LinkListItem header inDropdown>
                    {t('app.index.sections.proj')}
                  </LinkListItem>
                  <LinkListItem inDropdown href="/proiezioni-semplice">
                    {t('app.index.sections.simple')}
                  </LinkListItem>
                  <LinkListItem inDropdown href="/proiezioni-avanzata">
                    {t('app.index.sections.advanced')}
                  </LinkListItem>
                  <LinkListItem divider />
                  <LinkListItem header inDropdown>
                    {t('app.index.sections.hist')}
                  </LinkListItem>
                  <LinkListItem inDropdown href="/storico-semplice">
                    {t('app.index.sections.simple')}
                  </LinkListItem>
                  <LinkListItem inDropdown href="/storico-avanzata">
                    {t('app.index.sections.advanced')}
                  </LinkListItem>
                </LinkList>
              </DropdownMenu>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
      {isMobile && (
        <Toolbar sx={MenuSelectionMobileStyle}>
          <Typography variant={'caption'}>{selectedValueToString()}</Typography>
        </Toolbar>
      )}
    </FormControl>
  );
}

export default MapMenuBar;
