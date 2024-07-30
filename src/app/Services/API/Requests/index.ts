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

  public getLayers = () => this.instance.get<any>('/maps/maps/');

  public getCities = () => this.instance.get<any>('/places/cities/');

  public getTimeserie = (
    id: number | null,
    lat: number = 45.5,
    lng: number = 11,
  ) =>
    this.instance.get<any>(
      `/maps/ncss/timeserie/?id=${id}&latitude=${lat}&longitude=${lng}`,
    );

  // public getTimeserie = (id:number|null, lat:number = 45.5, lng:number = 11) => this.instance.get<any>(`/maps/timeserie/?id=${id}&latitude=${lat}&longitude=${lng}`);

  public getTimeseries = (
    ids: Array<number>,
    lat: number = 45.5,
    lng: number = 11,
  ) =>
    this.instance.get<any>(
      `/maps/ncss/timeserie/?ids=${ids.join(',')}&latitude=${lat.toFixed(
        4,
      )}&longitude=${lng.toFixed(4)}`,
    );

  private cartesianProduct = (input, current?) => {
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
      titems.push({ [k]: items[k] });
    }
    const combs = this.cartesianProduct(titems);
    for (const c of combs) {
      for (let j of Object.keys(c)) {
        ret.push(pattern.replaceAll('{' + j + '}', c[j]));
      }
    }
    return ret;
  }

  public getTimeseriesV2 = (
    ids: string[],
    lat: number,
    lng: number,
    withStation: boolean = true,
  ) => {
    const ret: Promise<AxiosResponse<any, any>>[] = [];
    for (let id of ids) {
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
    measure: any,
    lat: number,
    lng: number,
    withStation: boolean = true,
  ) => {
    let url = `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${measure}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(
      4,
    )})&datetime=..%2F..&include_coverage_data=true&coverage_data_smoothing=NO_SMOOTHING&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&coverage_data_smoothing=LOESS_SMOOTHING&include_coverage_uncertainty=true&include_coverage_related_data=true`;

    if (withStation) {
      url += `&include_observation_data=true&observation_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS`;
    } else {
      url += '&include_observation_data=false';
    }

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

  public getForecastAttribute = (attribute, params = {}) => {
    //const ret = this.instance
    //  .get<any>(
    //    'https://arpav.geobeyond.dev/api/v2/coverages/configuration-parameters?offset=0&limit=100',
    //  )
    //  .then((ret: any) => {
    //    const rd = ret.items.filter(x => {
    //      return x.name.indexOf(attribute.replaceAll('s', '')) >= 0;
    //    });
    //    return rd;
    //  }).then(d=>{
    //    if (d.length > 0){
    //      const fout = {
    //        results: d[0].allowed_values.map(x=>({id:x.name, 'name':x.display_name_italian, description:x.description_italian})),
    //        count: d[0].allowed_values.length,
    //        id: d[0].name,
    //        name: d[0].display_name_italian,
    //        description: d[0].description_italian
    //      }
    //      console.log(fout);
    //      return fout;
    //    } else {
    //      console.log({});
    //      return {}
    //    }
    //  });
    //return ret;
    if (attribute === 'scenarios') {
      return {
        count: 3,
        results: [
          {
            name: 'rcp26',
            description: 'Represents RCP26 scenario',
          },
          {
            name: 'rcp45',
            description: 'Represents RCP45 scenario',
          },
          {
            name: 'rcp85',
            description: 'Represents RCP85 scenario',
          },
        ],
      };
    } else if (attribute === 'year_periods') {
      return {
        count: 4,
        results: [
          {
            name: 'DJF',
            description:
              'Represents the winter season (December, January and February)',
          },
          {
            name: 'JJA',
            description: 'Represents the Summer season (June, July and August)',
          },
          {
            name: 'MAM',
            description: 'Represents the Spring season (March, April and May)',
          },
          {
            name: 'SON',
            description:
              'Represents the Autumn season (September, October and November)',
          },
        ],
      };
    } else if (attribute === 'time_windows') {
      return {
        count: 2,
        results: [
          {
            id: 'tw1',
            name: '2021-2050',
            description: 'Anomalia 2021-2050 rispetto a 1976-2005',
            order_item: 1,
          },
          {
            id: 'tw2',
            name: '2071-2100',
            description: 'Anomalia 2071-2100 rispetto a 1976-2005',
            order_item: 2,
          },
        ],
      };
    } else if (attribute === 'variables') {
      return {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 'tas_absolute_uncertainty_bounds_demo_upper_bounds',
            name: 'tas_absolute_uncertainty_bounds_demo_upper_bounds',
            description: 'tas_absolute_uncertainty_bounds_demo_upper_bounds',
            order_item: 1,
          },
          {
            id: 'tas_absolute_value_ensemble',
            name: 'tas_absolute_value_ensemble',
            description: 'tas_absolute_value_ensemble',
            order_item: 2,
          },
        ],
      };
    }
    return this.instance.get<any>(`/forcastattributes/${attribute}/`, {
      params,
    });
  };
}
