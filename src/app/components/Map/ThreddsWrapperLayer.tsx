import L, { TileLayer } from 'leaflet';
import { useMap, useMapEvent } from 'react-leaflet';
import { WMS_PROXY_URL, V2_WMS_PROXY_URL } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { useLeafletContext, withPane } from '@react-leaflet/core';
import { useEffect, useRef } from 'react';
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

  const getMethods = obj =>
    Object.getOwnPropertyNames(obj).filter(
      item => typeof obj[item] === 'function',
    );

  const setupFrontLayer = (layer, map, onlyRemove = false) => {
    if (layer && !onlyRemove) {
      layer.bringToFront();
    }
    //try {
    //  // eslint-disable-next-line array-callback-return
    //  Object.keys(map._layers).map((l: any) => {
    //    l = map._layers[l];
    //    if (l && l._url && l._url.includes(`public.places_cities.geometry`)) {
    //      l.bringToFront();
    //    }
    //    if (
    //      l &&
    //      l._url &&
    //      //l._url.includes(`${V2_WMS_PROXY_URL}`) &&
    //      !l._url.includes(map.selected_path)
    //    ) {
    //      map.removeLayer(l);
    //    }
    //    if (
    //      l &&
    //      l.currentLayer &&
    //      l.currentLayer._url &&
    //      //l.currentLayer._url.includes(`${V2_WMS_PROXY_URL}`) &&
    //      !l.currentLayer._url.includes(map.selected_path)
    //    ) {
    //      l.currentLayer.hide();
    //      map.removeLayer(l);
    //    }
    //  });
    //} catch (e) {
    //  console.log(e);
    //}
  };

  useMapEvent('baselayerchange', () =>
    setupFrontLayer(layer.current, context.map),
  );
  // @ts-ignore
  useMapEvent('timeload', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  useMapEvent('timeloading', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  useMapEvent('layeradd', () =>
    setupFrontLayer(layer.current, context.map, true),
  );
  // @ts-ignore
  useMapEvent('layerremove', () =>
    setupFrontLayer(layer.current, context.map, true),
  );

  useEffect(() => {
    const map = context.map;
    // @ts-ignore
    if (!map.setupFrontLayer) map.setupFrontLayer = setupFrontLayer;
    // @ts-ignore
    map.selected_path = selected_map.path;
    // @ts-ignore
    const selected_map_path = 'tas_annual_absolute_model_ensemble-rcp26';
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
        layers: 'tas',
        format: 'image/png',
        //numcolorbands: '100',
        version: '1.3.0',
        //colorscalerange: `${selected_map.color_scale_min},${selected_map.color_scale_max}`,
        //logscale: 'false',
        styles: `default-scalar/default`,
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
        { ...params, ...withPane(options, { __version: 1, map: map }) },
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
          map.addLayer(tdWmsLayer);
          // @ts-ignore
          setupFrontLayer(tdWmsLayer, context.map);
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
        }
      } else {
        map.addLayer(wmsLayer);
        setupFrontLayer(wmsLayer, context.map);
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
      }
    }
  }, [
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
