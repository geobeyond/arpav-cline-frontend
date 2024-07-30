import L, { TileLayer } from 'leaflet';
import { WMSTileLayer, useMap, useMapEvent } from 'react-leaflet';
import { WMS_PROXY_URL, V2_WMS_PROXY_URL } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import {
  useLeafletContext,
  withPane,
  useLayerLifecycle,
} from '@react-leaflet/core';
import { useEffect, useRef, useState } from 'react';
import 'leaflet-timedimension';
import './timedimension.extended';
import 'leaflet/dist/leaflet.css';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css';

export const ThreddsWrapperLayer = (props: any) => {
  const { selected_map } = useSelector((state: any) => state.map);
  const context = useLeafletContext();
  const layer = useRef<any>(null);
  const setLayer = (l: any) => {
    layer.current = l;
  };
  const setTimestatus = props.useTime;
  const useUncertainty = props.useUncertainty;

  const [tLayer, setTLayer] = useState<any>();
  const getMethods = obj =>
    Object.getOwnPropertyNames(obj).filter(
      item => typeof obj[item] === 'function',
    );

  // @ts-ignore
  //useMapEvent('timeload', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  // useMapEvent('timeloading', () => setupFrontLayer(layer.current, context.map));

  useEffect(() => {
    const map = context.layerContainer || context.map;
    // @ts-ignore
    //if (!map.setupFrontLayer) map.setupFrontLayer = setupFrontLayer;
    // @ts-ignore
    map.selected_path = selected_map.path;
    // @ts-ignore
    const selected_map_path =
      'tas_30yr_anomaly_seasonal_agree_model_ensemble-30yr-model_ensemble-tas-anomaly-rcp85-tw1-DJF';
    if (selected_map_path) {
      // @ts-ignore
      //if (
      //  layer.current &&
      //  layer.current._currentLayer &&
      //  layer.current._currentLayer._url &&
      //  layer.current._currentLayer._url.includes(
      //    `${WMS_PROXY_URL}/thredds/wms/`,
      //  ) &&
      //  layer.current._currentLayer._url.includes(selected_map.path)
      //) {
      //  setupFrontLayer(layer.current, map);
      //  return;
      //}
      let tdWmsLayer = null;
      const params = {
        service: 'WMS',
        layers: 'tas-uncertainty_group',
        format: 'image/png',
        //numcolorbands: '100',
        version: '1.3.0',
        //colorscalerange: `${selected_map.color_scale_min},${selected_map.color_scale_max}`,
        //logscale: 'false',
        styles: `uncert-stippled/seq-YlOrRd`,
        //elevation: null,
        //width: 256,
        transparent: true,
        crs: L.CRS.EPSG3857,
        //bounds: selected_map.bbox,
      };
      const options = {
        opacity: 0.85,
        attribution:
          '&copy; <a target="_blank" rel="noopener" href="https://www.arpa.veneto.it/">ARPAV - Arpa FVG</a>',
      };
      // @ts-ignore
      const wmsLayer = new TileLayer.WMS(
        `${V2_WMS_PROXY_URL}${selected_map_path}`,
        { ...params, ...withPane(options, { __version: 1, map: context.map }) },
      );
      if (selected_map.id && selected_map.data_series === 'yes') {
        // @ts-ignore
        tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
          requestTimeFromCapabilities: true,
          cache: 0,
          cacheBackward: 0,
          cacheForward: 0,
          zIndex: 1000,
        });
        if (tdWmsLayer) {
          setLayer(tdWmsLayer);
          try {
            // @ts-ignore
            map._controlContainer.getElementsByClassName(
              'leaflet-bar-timecontrol',
            )[0].style.display = 'flex';
            // @ts-ignore
            map._controlContainer.getElementsByClassName(
              'leaflet-time-info',
            )[0].style.display = 'flex';
            setTimestatus('flex');
          } catch (e) {
            // console.log(e)
          }
          layer.current = tdWmsLayer;
          setTLayer(tdWmsLayer);
        }
      } else {
        setLayer(wmsLayer);
        try {
          // @ts-ignore
          map._controlContainer.getElementsByClassName(
            'leaflet-bar-timecontrol',
          )[0].style.display = 'none';
          // @ts-ignore
          map._controlContainer.getElementsByClassName(
            'leaflet-time-info',
          )[0].style.display = 'none';
          setTimestatus('none');
        } catch (e) {
          // console.log(e)
        }
        layer.current = wmsLayer;
        setTLayer(wmsLayer);
      }
    }
    map.addLayer(layer.current);

    return () => {
      map.removeLayer(layer.current);
    };
  }, [
    context.layerContainer,
    context.map,
    selected_map.bbox,
    selected_map.color_scale_max,
    selected_map.color_scale_min,
    selected_map.data_series,
    selected_map.id,
    selected_map.layer_id,
    selected_map.palette,
    selected_map.path,
    setTimestatus,
  ]);

  return null;
};
