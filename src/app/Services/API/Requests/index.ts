import { AxiosResponse } from 'axios';
import { Http } from '../Http';

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

export class RequestApi extends Http {
  protected static classInstance?: RequestApi;
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new RequestApi();
    }
    return this.classInstance;
  }

  public getCities = (city) => this.instance.get<any>('/api/v2/municipalities/',{params:{offset: 0, limit: 5, name: city}});

  public getLayer = (
    variable?,
    model?,
    scenario?,
    measure?,
    time_period?,
    aggregation_period?,
    season?,
  ) => {
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
      filter += 'possible_value=time_window:' + time_period + '&';
    }
    if (aggregation_period) {
      filter += 'possible_value=aggregation_period:' + aggregation_period + '&';
    }
    if (season) {
      filter += 'possible_value=year_period:' + season + '&';
    }
    return this.instance
      .get<any>(
        'https://arpav.geobeyond.dev/api/v2/coverages/coverage-identifiers?' +
          filter,
      )
      .then((x: any) => {
        if (x.items.length > 0) {
          let xx = x.items.filter(
            itm =>
              JSON.stringify(itm.possible_values).indexOf('uncertainty') <= 0,
          );
          return { items: xx };
        } else return x;
      });
  };

  public getLayerConf = (conf: string) => {
    return this.instance.get<any>(conf);
  };

  public cartesianProduct = (input, current?) => {
    if (!input || !input.length) {
      return [];
    }

    var head = input[0];
    var tail = input.slice(1);
    var output: any[] = [];

    for (var key in head) {
      for (var i = 0; i < head[key].length; i++) {
        var newCurrent = this.copy(current);
        newCurrent[key] = head[key][i];
        if (tail.length) {
          var productOfTail = this.cartesianProduct(tail, newCurrent);
          output = output.concat(productOfTail);
        } else output.push(newCurrent);
      }
    }
    return output;
  };

  private copy: any = obj => {
    const res: any = {};
    for (const p in obj) res[p] = obj[p];
    return res;
  };

  public createIds(pattern: string, items: any) {
    let ret: string[] = [];
    let titems: any[] = [];

    for (let k of Object.keys(items)) {
      if (typeof items[k] !== 'object') {
        titems.push({ [k]: [items[k]] });
      } else {
        titems.push({ [k]: items[k] });
      }
    }
    const combs = this.cartesianProduct(titems);
    for (const c of combs) {
      let tpattern = pattern;
      for (let j of Object.keys(c)) {
        tpattern = tpattern.replaceAll('{' + j + '}', c[j]);
      }
      ret.push(tpattern);
    }
    return ret;
  }

  public getTimeseriesV2 = (
    series: string[],
    lat: number,
    lng: number,
    withStation: boolean = true,
  ) => {
    const ret: Promise<AxiosResponse<any, any>>[] = [];
    for (let id of series) {
      ret.push(this.getTimeserieV2(id, lat, lng, withStation));
      if (withStation) {
        withStation = false;
      }
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

  public getTimeserieV2 = (
    serie: string,
    lat: number,
    lng: number,
    withStation: boolean = true,
  ) => {
    let url = `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${serie}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(
      4,
    )})&datetime=..%2F..&include_coverage_data=true&coverage_data_smoothing=NO_SMOOTHING&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&coverage_data_smoothing=LOESS_SMOOTHING&include_coverage_uncertainty=true&include_coverage_related_data=true`;

    if (withStation) {
      url += `&include_observation_data=true&observation_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS`;
    } else {
      url += '&include_observation_data=false';
    }

    return this.instance.get<any>(url).then((x: any) => {
      x.series.map(a => {
        console.log('timeseries: ', a.name);
      });
      return x;
    });
  };

  public getTimeSeriesDataPoint = (
    serie: string,
    lat: number,
    lng: number,
    year: number,
  ) => {
    let url = `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${serie}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(4)})&datetime=${year + 1}%2F${
      year - 1
    }&include_coverage_data=true&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&include_coverage_related_data=true`;

    return this.instance.get<any>(url);
  };

  public getBarometroClimatico = () => {
    const ret: Promise<AxiosResponse<any, any>>[] = [];
    const measure =
      'tas_annual_absolute_model_ensemble-annual-model_ensemble-tas-absolute-{scenario}-year';
    const ids = this.createIds(measure, {
      scenario: ['rcp26', 'rcp45', 'rcp85'],
    });
    for (let id of ids) {
      ret.push(this.getBarometroClimaticoSingle(id, 44.9524, 11.5469));
    }
    return Promise.all(ret).then(x => {
      return this.merge.apply(this, x);
    });
  };
  public getBarometroClimaticoSingle = (
    measure: any,
    lat: number,
    lng: number,
  ) => {
    let url = `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${measure}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(
      4,
    )})&datetime=..%2F..&include_coverage_data=true&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&include_coverage_uncertainty=true&include_coverage_related_data=false`;

    url += '&include_observation_data=false';

    return this.instance.get<any>(url);
  };

  public findMunicipality = (lat, lng) => {
    return this.instance.get<any>(
      `https://arpav.geobeyond.dev/api/v2/municipalities?coords=POINT(${lng} ${lat})`,
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

  public getAttributes = () => {
    const ret = this.instance
      .get<any>(
        'https://arpav.geobeyond.dev/api/v2/coverages/configuration-parameters?offset=0&limit=100',
      )
      .then((d: any) => {
        return d.items;
      });
    return ret;
  };

  public getForecastAttribute = (attribute, params = {}) => {};
}
