const find_keys = [
  'variable',
  'forecast_model',
  'scenario',
  'data_series',
  'year_period',
  'value_type',
];

export const getValuesFor = (
  dictKey: string,
  input: Array<any>,
  filterDict: Object,
  exlude_keys: Array<string> = [],
): Array<any> => {
  // if(dictKey === 'time_window') {
  //   console.log('dictKey',dictKey)
  // }
  const params = Object.entries(filterDict).filter(
    ([key, value]) =>
      value !== null && dictKey !== key && !exlude_keys.includes(key),
  );
  const res = input
    .filter(item => params.every(([key, value]) => item[key] === value))
    .map(item => item[dictKey]);
  // console.log(dictKey, res)
  // @ts-ignore
  return [...new Set(res)];
};

export const findItemByFilters = (
  input: Array<any>,
  filterDict: Object,
): Array<any> => {
  const params = Object.entries(filterDict).filter(
    ([key, value]) => value !== null,
  );
  return input.filter(item =>
    params.every(([key, value]) => item[key] === value),
  );
};
export const getItemByFilters = (
  input: Array<any>,
  filterDict: Object,
): Array<any> => {
  const params = Object.entries(filterDict).filter(
    ([key, value]) => value !== null,
  );
  return input.find(item =>
    params.every(([key, value]) => item[key] === value),
  );
};

export const setSelectable = currentState => {
  const { selected_map, layers, forecast_parameters } = currentState;
  const filterDict = Object.fromEntries(
    Object.entries(selected_map).filter(([key]) => find_keys.includes(key)),
  );
  // console.log('selected_map.data_series',selected_map.data_series, {y:selected_map.data_series === 'no'})
  let selectable = getOptionsForForecastParameters(
    layers,
    filterDict,
    forecast_parameters.variables,
    selected_map.data_series,
  );
  while (Object.values(selectable).filter(x => x.length === 0).length > 1) {
    // @ts-ignore
    const lastKey = Object.entries(filterDict)
      .filter(([key, value]) => value !== null)
      .pop()[0];
    filterDict[lastKey] = null;
    selected_map[lastKey] = null;
    selectable = getOptionsForForecastParameters(
      layers,
      filterDict,
      forecast_parameters.variables,
      selected_map.data_series,
    );
    // console.log('LOOPING', filterDict, lastKey)
    // console.log('LOOPING without', lastKey)
  }
  return [selectable, selected_map];
};

export const getOptionsForForecastParameters = (
  layers,
  filterDict,
  variables,
  data_series,
) => {
  console.log(variables);
  return {
    // variables: getValuesFor('variable', currentState.layers, filterDict),
    variables: variables.map(x => x.id),
    forecast_models: getValuesFor('forecast_model', layers, filterDict),
    scenarios: getValuesFor('scenario', layers, filterDict),
    data_series: getValuesFor('data_series', layers, filterDict, [
      'time_windows',
      'value_type',
      'year_period',
    ]),
    year_periods: getValuesFor('year_period', layers, filterDict),
    time_windows:
      data_series === 'no'
        ? getValuesFor('time_window', layers, filterDict)
        : [],
    value_types: getValuesFor('value_type', layers, filterDict),
  };
};

export const roundTo4 = (num: number, or?: number) => {
  try {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: or ?? 2,
      maximumFractionDigits: or ?? 4,
    });
  } catch (ex) {
    return '';
  }
};

export const caculateMovingAverage = (
  data: number[],
  window: number = 11,
): number[] => {
  let result: Array<number> = [];
  if (data.length < window) {
    return result;
  }
  let sum = 0;
  for (let i = 0; i < window; ++i) {
    sum += data[i];
  }
  // @ts-ignore
  result.push((sum / window).toFixed(1));
  const steps = data.length - window - 1;
  for (let i = 0; i < steps; ++i) {
    sum -= data[i];
    sum += data[i + window];
    // @ts-ignore
    result.push((sum / window).toFixed(1));
  }
  return result;
};
