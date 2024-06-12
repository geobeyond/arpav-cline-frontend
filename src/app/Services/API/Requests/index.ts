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

  public getMultiTimeseriesV2 = (id: string[], lat: number, lng: number) => {
    const ret: Promise<AxiosResponse<any, any>>[] = [];
    for (let ids of id) {
      ret.push(this.getTimeseriesV2(ids, lat, lng));
    }
    return Promise.all(ret);
  };

  public getTimeseriesV2 = (
    measure: any,
    lat: number,
    lng: number,
    withStation: boolean = true,
  ) => {
    measure = 'tas_annual_absolute_model_ensemble-rcp26';
    let url = `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${measure}?coords=POINT(${lng.toFixed(
      4,
    )} ${lat.toFixed(
      4,
    )})&datetime=..%2F..&include_coverage_data=true&coverage_data_smoothing=NO_SMOOTHING&coverage_data_smoothing=LOESS_SMOOTHING&coverage_data_smoothing=MOVING_AVERAGE_11_YEARS&include_coverage_uncertainty=true&include_coverage_related_data=true&`;

    if (withStation) {
      url += `include_observation_data=true&observation_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS`;
    }

    return this.instance.get<any>(url);
  };

  public getBarometroClimatico = () => {
    const measure = 'tas_annual_absolute_model_ensemble';
    return Promise.all([
      this.instance.get<any>(
        `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${measure}-rcp26?coords=POINT%2811.5469%2044.9524%29&datetime=..%2F..&include_coverage_data=true&include_observation_data=true&coverage_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS&include_coverage_uncertainty=true&include_coverage_related_data=false`,
      ),
      this.instance.get<any>(
        `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${measure}-rcp45?coords=POINT%2811.5469%2044.9524%29&datetime=..%2F..&include_coverage_data=true&include_observation_data=true&coverage_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS&include_coverage_uncertainty=true&include_coverage_related_data=false`,
      ),
      this.instance.get<any>(
        `https://arpav.geobeyond.dev/api/v2/coverages/time-series/${measure}-rcp85?coords=POINT%2811.5469%2044.9524%29&datetime=..%2F..&include_coverage_data=true&include_observation_data=true&coverage_data_smoothing=NO_SMOOTHING&observation_data_smoothing=MOVING_AVERAGE_5_YEARS&include_coverage_uncertainty=true&include_coverage_related_data=false`,
      ),
    ]).then(data => {
      data[0].series.push(data[1].series[0]);
      data[0].series.push(data[2].series[0]);
      return data[0];
    });
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
