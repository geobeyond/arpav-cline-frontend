import axios, { AxiosResponse } from 'axios';
import { Http } from '../Http';
import { P } from 'app/pages/NotFoundPage/P';
import {
  BACKEND_API_URL,
  BACKEND_WMS_BASE_URL,
} from '../../../../utils/constants';

export interface AuthResponse {
  [key: string]: {};
}

export interface ListResults<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface iNetcdfDownload {
  id: number;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  public?: number;
  reason?: string;
  other_reason?: string;
  place?: string;
  membership?: string;
  accept_disclaimer?: boolean;
}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export class RequestApi extends Http {
  downloadScreenshot(href: string, filename: string) {
    href = href.replaceAll(
      'http://localhost:3000',
      'https://arpav.geobeyond.dev',
    );
    return (
      this.instance
        .get<any>(BACKEND_API_URL + '/maps/map-screenshot', {
          params: {
            url: href + '&op=screenshot',
          },
          responseType: 'blob',
        })
        //@ts-ignore
        .then((response: Blob) => {
          const url = window.URL.createObjectURL(response);
          console.log(url);
          // create file link in browser's memory

          // create "a" HTML element with href to file & click
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename); //or any other extension
          document.body.appendChild(link);
          link.click();

          // clean up "a" element & remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        })
        .catch(err => {
          console.log(err);
        })
    );
  }
  getCapabilities(wms) {
    const fullUrl =
      BACKEND_WMS_BASE_URL +
      '/' +
      wms +
      '?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&verbose=true';

    return this.instance
      .get<string>(fullUrl, {
        responseType: 'text',
      })
      .then(x => {
        localStorage.setItem(fullUrl, JSON.stringify(x));
        return x;
      });
  }

  /**
   * Fetches forecast data from the API.
   * @param {any} configuration Configuration of the request.
   * @param {any} dataSet Additional data to be used in the request.
   * @returns {Promise<AxiosResponse<any>>} The response of the request.
   */
  getForecastData(configuration: any, dataSet?: any, language: string = 'it') {
    let configs = [];
    return this.getConfigurationParams().then(configs => {
      const labelsf = configs.map((config: any) =>
        config.allowed_values.map(x => [
          x.name,
          [
            config.name,
            language === 'it' ? x.display_name_italian : x.display_name_english,
          ],
        ]),
      );
      const labels = Object.fromEntries(labelsf.flat());
      const innerConf = {
        ...configuration,
        ...{
          download_reason: dataSet.downloadReason,
          entity_name: dataSet.entity_name,
          is_public_sector: dataSet.is_public_sector === 'true',
        },
      };
      delete innerConf.archive;
      if (innerConf.aggregation_period === 'annual') {
        delete innerConf.time_window;
      }
      return this.instance
        .get<any>(BACKEND_API_URL + '/coverages/forecast-data?', {
          params: { offset: 0, limit: 100, ...innerConf },
          paramsSerializer: { indexes: null },
          timeout: 30000,
        })
        .then((found: any) => {
          /**
           * Maps the array of coverage download links to an array of objects containing the URL and label of the coverage.
           * @param {string} x The coverage download link.
           * @returns {object} An object containing the URL and label of the coverage.
           */
          const mapCoverageLinks = (x: string) => {
            const url =
              x +
              (dataSet
                ? `?coords=POLYGON ((${dataSet.east} ${dataSet.south}, ${dataSet.west} ${dataSet.south}, ${dataSet.west} ${dataSet.north}, ${dataSet.east} ${dataSet.north}, ${dataSet.east} ${dataSet.south}))&datetime=${dataSet.time_start}-01-01/${dataSet.time_end}-12-31`
                : '');
            const label = x.split('/')[x.split('/').length - 1];
            const tlabel = label.split('-');
            const flabel = tlabel
              .map(x => {
                if (Object.keys(labels).indexOf(x) >= 0) return labels[x];
                else return null;
              })
              .filter(x => x);
            const dconf: any = {
              ...{ time_window: null },
              ...Object.fromEntries(flabel),
            };
            const labelout =
              `${
                dconf.climatological_variable
                  ? dconf.climatological_variable
                  : dconf.historical_variable
              } - ${dconf.archive} - ${dconf.climatological_model} - ${
                dconf.scenario
              } - ${dconf.aggregation_period} - ${dconf.measure} - ` +
              (dconf.time_period ? `${dconf.time_period} - ` : '') +
              `${dconf.year_period}` +
              (dconf.uncertainty_type ? ` - ${dconf.uncertainty_type}` : '');
            return { url, rawLabel: label, label: labelout };
          };
          return found.coverage_download_links.map(mapCoverageLinks);
        });
    });
  }

  protected static classInstance?: RequestApi;
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new RequestApi();
    }
    return this.classInstance;
  }

  public getCities = () => {
    if (localStorage.getItem('municipality-centroids')) {
      // @ts-ignore
      let cities = JSON.parse(localStorage.getItem('municipality-centroids'));
      let lastCities = [];
      if (localStorage.getItem('lastCities')) {
        // @ts-ignore
        lastCities = JSON.parse(localStorage.getItem('lastCities'));
      }
      let fcities = cities.filter(city => {
        let found = false;
        for (let c of lastCities) {
          if (c) {
            //@ts-ignore
            if (c.label === city.label) found = true;
          }
        }
        return !found;
      });
      return [...lastCities, ...fcities];
    } else {
      this.instance
        .get<any>(BACKEND_API_URL + '/municipalities/municipality-centroids')
        .then((x: any) => x.features)
        .then(x => {
          return x.map(c => ({
            label: c.properties.name,
            id: c.id,
            latlng: {
              lat: c.geometry.coordinates[1],
              lng: c.geometry.coordinates[0],
            },
          }));
        })
        .then(x => {
          localStorage.setItem('municipality-centroids', JSON.stringify(x));
        });
      // @ts-ignore
      return JSON.parse(localStorage.getItem('municipality-centroids'));
    }
  };

  public getHistoricLayer = (
    variable?,
    measure?,
    time_period?,
    aggregation_period?,
    season?,
  ) => {
    return this.doGetLayer(
      variable,
      undefined,
      undefined,
      measure,
      time_period,
      aggregation_period,
      season,
      'historical',
    );
  };

  public getLayer = (
    variable?,
    model?,
    scenario?,
    measure?,
    time_period?,
    aggregation_period?,
    season?,
  ) => {
    if (model.indexOf('model_ensemble') < 0) {
      return Promise.all([
        this.doGetLayer(
          variable,
          model,
          scenario,
          measure,
          time_period,
          aggregation_period,
          season,
        ),
        this.doGetLayer(
          variable,
          'model_ensemble',
          scenario,
          measure,
          time_period,
          aggregation_period,
          season,
        ),
      ]).then(x => {
        if (x[0].items.length > 0) {
          x[0].items[0]['ensemble_data'] = x[1].items[0];
        }
        return x[0];
      });
    } else {
      return this.doGetLayer(
        variable,
        model,
        scenario,
        measure,
        time_period,
        aggregation_period,
        season,
      );
    }
  };

  public getLayers = (
    variable?: string,
    model?: string | string[],
    scenario?: string | string[],
    measure?: string,
    time_period?: string,
    aggregation_period?: string,
    season?: string,
  ) => {
    const items = {
      climatological_variable: variable,
      climatological_model: model,
      scenario: scenario,
      measure: measure,
      time_period: time_period,
      aggregation_period: aggregation_period,
      year_period: season,
    };
    let titems: any[] = [];

    for (let k of Object.keys(items)) {
      if (items[k]) {
        if (typeof items[k] !== 'object') {
          titems.push({ [k]: [items[k]] });
        } else {
          titems.push({ [k]: items[k] });
        }
      }
    }
    const combs: any[] = this.cartesianProduct(titems);
    let reqs: any = [];
    for (let c of combs) {
      reqs.push(
        this.doGetLayer(
          c.climatological_variable,
          c.climatological_model,
          c.scenario,
          c.measure,
          c.time_period,
          c.aggregation_period,
          c.year_period,
        ),
      );
    }

    return Promise.all(reqs).then(lyrs => {
      let ret: any[] = [];
      for (let lyr of lyrs) {
        ret = [...ret, ...lyr.items];
      }
      return { ...lyrs[0], ...{ items: ret } };
    });
  };

  /**
   * Fetches the layer configuration from the API, based on the given filters.
   * @param {string} [variable] The variable to filter by.
   * @param {string} [model] The model to filter by.
   * @param {string} [scenario] The scenario to filter by.
   * @param {string} [measure] The measure to filter by.
   * @param {string} [time_period] The time period to filter by.
   * @param {string} [aggregation_period] The aggregation period to filter by.
   * @param {string} [season] The season to filter by.
   * @returns {Promise<AxiosResponse<any>>} The response of the request.
   */
  public doGetLayer = (
    variable?: string,
    model?: string,
    scenario?: string,
    measure?: string,
    time_period?: string,
    aggregation_period?: string,
    season?: string,
    mode?: string,
  ) => {
    if (!mode) {
      mode = 'forecast';
    }
    // Create the filter string based on the given parameters.
    let filter = '';
    if (variable) {
      filter += 'possible_value=climatological_variable:' + variable + '&';
    }
    if (model) {
      filter += 'possible_value=climatological_model:' + model + '&';
    }
    if (scenario) {
      filter += 'possible_value=scenario:' + scenario + '&';
    }
    if (measure) {
      filter += 'possible_value=measure:' + measure + '&';
    }
    if (time_period && aggregation_period !== 'annual') {
      filter +=
        'possible_value=' +
        (mode === 'forecast' ? 'time_window' : 'reference_period') +
        ':' +
        time_period +
        '&';
    }
    if (aggregation_period) {
      filter +=
        'possible_value=' +
        (mode === 'forecast' ? 'aggregation_period' : 'aggregation_period') +
        ':' +
        aggregation_period +
        '&';
    }
    if (season) {
      filter +=
        'possible_value=' +
        (mode === 'forecast' ? 'year_period' : 'historical_year_period') +
        ':' +
        season +
        '&';
    }
    filter += 'possible_value=archive:' + mode + '&';

    const fullUrl = BACKEND_API_URL + '/coverages/coverages?' + filter;

    console.log(fullUrl);
    const d = localStorage.getItem(fullUrl);
    if (d) {
      return Promise.resolve(JSON.parse(d)).then((x: any) => {
        console.log(x);
        // If the response contains items, filter out the ones with uncertainty.
        //if (x.items.length > 0) {
        //  let xx = x.items.filter(
        //    itm =>
        //      JSON.stringify(itm.possible_values).indexOf('uncertainty') < 0,
        //  );
        //  return { items: xx };
        //} else
        return x;
      });
    }

    // Make the request to the API.
    return this.instance
      .get<any>(BACKEND_API_URL + '/coverages/coverages?' + filter)
      .then((x: any) => {
        localStorage.setItem(fullUrl, JSON.stringify(x));
        console.log(x);
        // If the response contains items, filter out the ones with uncertainty.
        //if (x.items.length > 0) {
        //  let xx = x.items.filter(
        //    itm =>
        //      JSON.stringify(itm.possible_values).indexOf('uncertainty') < 0,
        //  );
        //  return { items: xx };
        //} else
        return x;
      });
  };
  /**
   * Retrieves layer configuration from the API.
   * @param {any} conf The configuration object containing URLs for fetching data.
   * @returns {Promise<any>} The resolved configuration data, potentially with ensemble data included.
   */
  public getLayerConf = (conf: any): Promise<any> => {
    console.log('getLayerConf');
    console.log(conf);
    if ('ensemble_data' in conf) {
      // Fetch both the main and ensemble data configurations concurrently
      return Promise.all([
        this.instance.get<any>(conf.url),
        this.instance.get<any>(conf.ensemble_data.url),
      ]).then(responses => {
        console.log('getLayerConf: Fetched both main and ensemble data');
        console.log(responses);
        // Attach ensemble data to the main configuration
        responses[0].ensemble_data = responses[1];
        return responses[0];
      });
    } else {
      const lc = localStorage.getItem(conf.url);
      if (lc) {
        const ret = JSON.parse(lc);
        ret.wms_main_layer_name = conf.wms_main_layer_name;
        ret.wms_secondary_layer_name = conf.wms_secondary_layer_name;
        return Promise.resolve(ret);
      } else {
        // Fetch only the main data configuration
        return this.instance.get<any>(conf.url).then(response => {
          if (conf.wms_main_layer_name) {
            //@ts-ignore
            response.wms_main_layer_name = conf.wms_main_layer_name;
          }
          if (conf.wms_secondary_layer_name) {
            //@ts-ignore
            response.wms_secondary_layer_name = conf.wms_secondary_layer_name;
          }
          localStorage.setItem(conf.url, JSON.stringify(response));
          console.log('getLayerConf: Fetched only main data');
          console.log(response);
          return response;
        });
      }
    }
  };

  public cartesianProduct = (input, current?) => {
    if (!input || !input.length) {
      return [];
    }

    let head = input[0];
    let tail = input.slice(1);
    let output: any[] = [];

    for (var key in head) {
      if (head[key]) {
        for (var i = 0; i < head[key].length; i++) {
          var newCurrent = this.copy(current);
          newCurrent[key] = head[key][i];
          if (tail.length) {
            var productOfTail = this.cartesianProduct(tail, newCurrent);
            output = output.concat(productOfTail);
          } else output.push(newCurrent);
        }
      }
    }
    return output;
  };

  private copy: any = obj => {
    const res: any = {};
    for (const p in obj) res[p] = obj[p];
    return res;
  };

  public createIds(items: any) {
    console.log('pattern');
    let ret: string[] = [];
    let titems: any[] = [];

    for (let k of Object.keys(items)) {
      if (items[k]) {
        if (typeof items[k] !== 'object') {
          titems.push({ [k]: [items[k]] });
        } else {
          titems.push({ [k]: items[k] });
        }
      }
    }
    const combs = this.cartesianProduct(titems);
    const reqs: Promise<any>[] = [];
    for (const c of combs) {
      reqs.push(
        this.doGetLayer(
          c.climatological_variable,
          c.climatological_model,
          c.scenario,
          c.measure,
          c.time_period,
          c.aggregation_period,
          c.year_period,
          c.archive,
        ),
      );
    }
    return Promise.all(reqs).then(data => {
      return data.map(x => x.items[0].identifier);
    });
  }

  public getTimeseriesV2 = (
    series: string[],
    lat: number,
    lng: number,
    withStation: boolean = true,
    mode: string = 'forecast',
    mkfrom: string = '..',
    mkto: string = '..',
  ) => {
    const ret: Promise<AxiosResponse<any, any>>[] = [];
    if (mode === 'forecast') {
      for (let id of series) {
        ret.push(
          this.getTimeserieV2(
            id,
            lat,
            lng,
            withStation,
            true,
            true,
            true,
            mode,
          ),
        );
        if (withStation) {
          withStation = false;
        }
      }
    } else {
      ret.push(
        this.getTimeserieV2(
          series[0],
          lat,
          lng,
          false,
          true,
          true,
          true,
          mode,
          mkfrom,
          mkto,
        ),
      );
    }
    return Promise.all(ret).then(x => {
      return this.merge.apply(this, x);
    });
  };

  private merge = (...objs) =>
    [...objs].reduce(
      (acc, obj) =>
        Object.keys(obj).reduce((a, k) => {
          acc[k] = acc.hasOwnProperty(k)
            ? [].concat(acc[k]).concat(obj[k])
            : obj[k];
          return acc;
        }, {}),
      {},
    );

  public updateCache = () => {
    this.instance.get(`${BACKEND_API_URL}/base`).then((x: any) => {
      const curr = localStorage.getItem('git_commit');
      console.log('current_version', curr);
      if (curr) {
        if (curr !== x.git_commit) {
          localStorage.clear();
          console.log('localStorage cleaered');
        }
        localStorage.setItem('git_commit', x.git_commit);
      } else {
        localStorage.clear();
        console.log('localStorage cleaered');
        localStorage.setItem('git_commit', x.git_commit);
      }
    });
  };

  public getTimeserieV2 = (
    serie: string,
    lat: number,
    lng: number,
    withStation: boolean = true,
    related: boolean = true,
    smoothing: boolean = true,
    uncertainty: boolean = true,
    mode: string = 'forecast',
    mkfrom: string = '..',
    mkto: string = '..',
  ) => {
    serie.indexOf('forecast') >= 0 ? (mode = 'forecast') : (mode = 'past');
    const ep =
      mode === 'forecast' ? 'forecast-time-series' : 'historical-time-series';
    let url = `${BACKEND_API_URL}/coverages/${ep}/${serie}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(
      4,
    )})&datetime=..%2F..&include_coverage_data=true&coverage_data_smoothing=NO_SMOOTHING`;
    if (smoothing) {
      if (mode === 'forecast') {
        url +=
          '&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&coverage_data_smoothing=LOESS_SMOOTHING';
      } else {
        url += `&mann_kendall_datetime=${mkfrom}%2F${mkto}&include_moving_average_series=true&include_decade_aggregation_series=true&include_loess_series=true`;
      }
    }
    if (uncertainty) {
      url += '&include_coverage_uncertainty=true';
    } else {
      url += '&include_coverage_uncertainty=false';
    }
    if (related) {
      url += '&include_coverage_related_data=true';
    } else {
      url += '&include_coverage_related_data=false';
    }
    if (withStation) {
      url += `&include_observation_data=true&observation_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS`;
    } else {
      url += '&include_observation_data=false';
    }
    if (mode !== 'forecast') {
    }

    return this.instance
      .get<any>(url)
      .then((x: any) => {
        x.series.map(a => {
          console.log('timeseries: ', a.name);
        });
        return x;
      })
      .catch(error => {
        return { series: [] };
      });
  };

  public getTimeSeriesDataPoint = (
    serie: string,
    lat: number,
    lng: number,
    year: number,
    mode: string = 'forecast',
  ) => {
    const ep =
      mode === 'forecast' ? 'forecast-time-series' : 'historical-time-series';
    let url = `${BACKEND_API_URL}/coverages/${ep}/${serie}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(4)})&datetime=${year + 1}%2F${
      year - 1
    }&include_coverage_data=true&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&include_coverage_related_data=true`;

    return this.instance.get<any>(url);
  };

  public getBarometroClimatico = () => {
    let url = `${BACKEND_API_URL}/coverages/time-series/climate-barometer?data_smoothing=MOVING_AVERAGE_11_YEARS&include_uncertainty=true`;
    console.log(url);
    return this.instance.get<any>(url);
  };

  public findMunicipality = (lat, lng) => {
    return this.instance.get<any>(
      `${BACKEND_API_URL}/municipalities/municipalities?coords=POINT(${lng} ${lat})`,
    );
  };

  public downloadTimeseries = params =>
    this.instance.post<any>(`/maps/ncss/timeserie/`, params, {
      responseType: 'blob',
    });

  public getNetcdf = (params: iNetcdfDownload) =>
    this.instance.post<any>(`/maps/ncss/netcdf/`, params, {
      responseType: 'blob',
    });

  // public getNetcdf = (params) => {
  //   return this.instance.get<any>(`/maps/ncss/netcdf/?${(new URLSearchParams(params)).toString()}`, {responseType: 'blob'});
  // }

  public getConfigurationParams = (force: boolean = false) => {
    const c = localStorage.getItem('configs');
    if (c) {
      return Promise.resolve(JSON.parse(c));
    }
    return this.instance
      .get<any>(
        `${BACKEND_API_URL}/coverages/configuration-parameters?offset=0&limit=100`,
      )
      .then((d: any) => {
        return d.items;
      })
      .then((d: any) => {
        localStorage.setItem('configs', JSON.stringify(d));
        return d;
      });
  };

  public extractPossibleValues = combinations => {
    const possibleValues = {};

    combinations.forEach(comb => {
      Object.keys(comb).forEach(key => {
        if (key === 'other_parameters') {
          Object.keys(comb[key]).forEach(param => {
            if (!possibleValues[param]) {
              possibleValues[param] = new Set();
            }
            comb[key][param].forEach(value => possibleValues[param].add(value));
          });
        } else {
          if (!possibleValues[key]) {
            possibleValues[key] = new Set();
          }
          possibleValues[key].add(comb[key]);
        }
      });
    });

    // Convert sets to arrays
    Object.keys(possibleValues).forEach(key => {
      possibleValues[key] = Array.from(possibleValues[key]);
    });

    return possibleValues;
  };

  public getAttributes = (
    data: string = 'forecast',
    mode: string = 'advanced',
    force: boolean = false,
  ) => {
    console.log('getAttributes', data, mode, force);
    let reqs: any[] = [];

    const ret = this.instance
      .get<any>(
        `${BACKEND_API_URL}/coverages/configuration-parameters?offset=0&limit=100`,
      )
      .then((d: any) => {
        return d.items;
      });
    reqs.push(ret);
    if (data === 'forecast') {
      const cret = this.instance.get<any>(
        `${BACKEND_API_URL}/coverages/forecast-variable-combinations?navigation_section=${mode}`,
      );
      reqs.push(cret);
    } else {
      const cret = this.instance.get<any>(
        `${BACKEND_API_URL}/coverages/historical-variable-combinations?navigation_section=${mode}`,
      );
      reqs.push(cret);
    }

    const p = Promise.all(reqs).then(x => {
      let configs = x[0];
      let combs = x[1].combinations;

      let possibleValues = this.extractPossibleValues(combs);
      console.log(possibleValues);

      let fconfigs: any[] = [];

      for (let config of configs) {
        if (
          Object.keys(possibleValues).indexOf(config.name) >= 0 &&
          possibleValues[config.name].length > 0
        ) {
          config.allowed_values = config.allowed_values.filter(x => {
            return possibleValues[config.name].indexOf(x.name) >= 0;
          });
          fconfigs.push(config);
        }
      }

      console.log(fconfigs);

      localStorage.setItem('configs', JSON.stringify(configs));
      localStorage.setItem('combs::' + mode, JSON.stringify(combs));
      return {
        items: fconfigs,
        combinations: combs,
      };
    });
    return p;
  };

  public getForecastAttribute = (attribute, params = {}) => {};

  public getAppVersion = () => {
    const ret = this.instance.get<any>(
      `${BACKEND_API_URL}/coverages/configuration-parameters?offset=0&limit=100`,
    );
  };
}
