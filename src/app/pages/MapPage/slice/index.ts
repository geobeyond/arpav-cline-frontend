import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  ChangeMapSelectionPatyload,
  Filters,
  iBaseParameterItem,
  iCityItem,
  iLayerItem,
  MapState,
} from './types';
import {
  findItemByFilters,
  setSelectable,
} from '../../../../utils/json_manipulations';

export const attributesList = [
  'variables',
  'forecast_models',
  'scenarios',
  'data_series',
  'year_periods',
  'time_windows',
  'value_types',
];

export interface GenericErrorType {
  error: string;
}

export const find_keys = [
  'variable',
  'forecast_model',
  'scenario',
  'data_series',
  'year_period',
  'value_type',
];
export const full_find_keys = [
  'variable',
  'forecast_model',
  'scenario',
  'data_series',
  'year_period',
  'value_type',
  'time_window',
];
export const cityTerms = ['name', 'lat', 'lng'];

export const initialState: MapState = {
  selected_map: {
    // id: 2630,
    variable_id: 'TAS',
    forecast_model_id: 'model_ensemble',
    scenario_id: 'Rcp85',
    data_series_id: 'no',
    year_period_id: 'djf',
    time_window_id: 'tw1',
    value_type_id: 'anomaly',
    time_start: '2050-02-28T12:00:00Z',
    time_end: '2050-02-28T12:00:00Z',
    time_interval: null,
    csr: 'CRS:84',
    layer_id: 'tas',
    path: 'ensembletwbc/tas_avg_anom_tw1…85_DJF.nc',
    palette: 'seq-YlOrRd',
    unit: 'K',
    color_scale_min: 272,
    color_scale_max: 280,
    bbox: [
      [14.2, 10],
      [47.3, 44.4],
    ],
    elevation: 2,
    legend:
      '/thredds/wms/ensembletwbc/tas_avg_anom_tw1…85_DJF.nc?REQUEST=GetLegendGraphic&numcolorbands=100&LAYERS=tas&STYLES=default-scalar%2Fseq-YlOrRd',
    spatialbounds: {
      type: 'Polygon',
      coordinates: [
        [
          [10.050000388447831, 44.49987030029297],
          [10.050000388447831, 47.39982604980469],
          [14.249999802287032, 47.39982604980469],
          [14.249999802287032, 44.49987030029297],
          [10.050000388447831, 44.49987030029297],
        ],
      ],
    },
    variable: 'TAS',
    forecast_model: 'model_ensemble',
    scenario: 'Rcp85',
    data_series: 'no',
    year_period: 'djf',
    time_window: 'tw1',
    value_type: 'anomaly',
  },
  timeserie: [],
  selectactable_parameters: {
    variables: [],
    forecast_models: [],
    scenarios: [],
    data_series: [],
    year_periods: [],
    time_windows: [],
    value_types: [],
  },
  forecast_parameters: {
    variables: [],
    forecast_models: [],
    scenarios: [],
    data_series: [],
    year_periods: [],
    time_windows: [],
    value_types: [],
  },
  opacity: 0.85,
  layers: [],
  cities: [],
  city: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
    loadParameters(state) {},
    loadLayers(state) {
      // state.forecast_parameters = {};
    },
    loadCities(state) {},
    citiesLoaded(state, action: PayloadAction<any>) {},
    parametersLoaded: function (
      state,
      action: PayloadAction<iBaseParameterItem[][]>,
    ) {},
    layerLoaded: function (state, action: PayloadAction<iLayerItem[]>) {},
    genericError(state, action: PayloadAction<GenericErrorType>) {},
    setMap(state, action: PayloadAction<Filters>) {},
    changeSelection(
      state,
      action: PayloadAction<ChangeMapSelectionPatyload>,
    ) {},
    requestTimeserie(
      state,
      action: PayloadAction<{ id: number; lat?: number; lng?: number }>,
    ) {},
    setTimeserie(state, action: PayloadAction<any>) {},
    setOpacity(state, action: PayloadAction<number>) {},
    setCity(state, action: PayloadAction<iCityItem>) {},
  },
});

export const { actions: mapActions } = slice;

export const useMapSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  //useInjectSaga({ key: slice.name, saga: mapSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useMapSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
