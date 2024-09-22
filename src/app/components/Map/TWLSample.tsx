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

export const TWLSample = (props: any) => {
  //const { selected_map } = useSelector((state: any) => state.map);
  const context = useLeafletContext();
  const isTimeseries = props.isTimeseries;
  const layer = useRef<any>(null);
  const setLayer = (l: any) => {
    layer.current = l;
  };
  const zIndex = props.zIndex;
  const setTimestatus = props.useTime;
  const lyr = props.layer;
  const show = props.show;
  const style = props.stl;
  const opacity = props.opacity;

  const [tLayer, setTLayer] = useState<any>();
  const getMethods = obj =>
    Object.getOwnPropertyNames(obj).filter(
      item => typeof obj[item] === 'function',
    );

  // @ts-ignore
  //useMapEvent('timeload', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  //useMapEvent('timeloading', () => setupFrontLayer(layer.current, context.map));

  useEffect(() => {
    if (lyr && show) {
      const map = context.map;
      // @ts-ignore
      //if (!map.setupFrontLayer) map.setupFrontLayer = setupFrontLayer;
      // @ts-ignore
      //map.selected_path = selected_map.path;
      // @ts-ignore
      const selected_map_path = lyr;
      if (selected_map_path) {
        let tdWmsLayer = null;
        const params = {
          service: 'WMS',
          layers: show,
          format: 'image/png',
          //numcolorbands: '100',
          version: '1.3.0',
          //colorscalerange: `${selected_map.color_scale_min},${selected_map.color_scale_max}`,
          //logscale: 'false',
          styles: style,
          //elevation: null,
          //width: 256,
          transparent: true,
          crs: L.CRS.EPSG3857,
          //bounds: selected_map.bbox,
        };
        const options = {
          opacity: opacity,
          zIndex: zIndex,
          attribution:
            '&copy; <a target="_blank" rel="noopener" href="https://www.arpa.veneto.it/">ARPAV - Arpa FVG</a>',
        };
        const tlUrl = `${V2_WMS_PROXY_URL}${selected_map_path}`;
        // @ts-ignore
        const wmsLayer = new TileLayer.WMS(tlUrl, {
          ...params,
          ...withPane(options, { __version: 1, map: context.map }),
        });

        if (selected_map_path && isTimeseries) {
          // @ts-ignore
          tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
            requestTimeFromCapabilities: true,
            cache: 0,
            cacheBackward: 0,
            cacheForward: 0,
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
          //}
        }
        map.addLayer(layer.current);

        return () => {
          map.removeLayer(layer.current);
        };
      }
    }
  }, [
    context.layerContainer,
    context.map,
    lyr,
    setTimestatus,
    isTimeseries,
    opacity,
    show,
    style,
  ]);

  return null;
};
