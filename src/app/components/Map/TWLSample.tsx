import L, { TileLayer } from 'leaflet';
import { WMSTileLayer, useMap, useMapEvent } from 'react-leaflet';
import { BACKEND_WMS_BASE_URL } from '../../../utils/constants';
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
  const setCurrentYear = props.setCurrentYear;

  const mode = props.mode;
  const data = props.data;
  const currentMap = props.currentMap;
  const [isSh, setIsSh] = useState(false);
  const setCY = yr => {
    localStorage.setItem('currentYear', yr.toString());
  };

  const getCY = () => {
    const cy = localStorage.getItem('currentYear');
    if (cy) {
      return cy;
    } else {
      return 0;
    }
  };

  const [yearSet, setYearSet] = useState(false);

  const [tLayer, setTLayer] = useState<any>();
  const getMethods = obj =>
    Object.getOwnPropertyNames(obj).filter(
      item => typeof obj[item] === 'function',
    );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (
      url.searchParams.has('op') &&
      url.searchParams.get('op') === 'screenshot'
    ) {
      setIsSh(true);
      if (url.searchParams.has('year')) {
        const y = url.searchParams.get('year');
        if (y) {
          setTimeout(() => {
            setCurrYear(parseInt(y), data);
          }, 1250);
        }
      }
    }
  }, [tLayer]);

  const setCurrYear = (yr, data = 'forecast') => {
    const date = new Date();
    if (
      getCY() !== (yr + (data === 'forecast' ? 0 : 1)).toString() ||
      getCY() !== yr.toString()
    ) {
      setTimeout(() => {
        console.log('setting current year from Leaflet Timedmension:', yr);
        date.setFullYear(yr + (data === 'forecast' ? 0 : 1));
        setCurrentYear(yr);
        setCY(yr);
        setYearSet(true);
        //@ts-ignore
        //context.map.timeDimension.setCurrentTime(date.getTime());

        let url = new URL(window.location.href);
        if (url.searchParams.has('year')) {
          url.searchParams.set('year', yr.toString());
        } else {
          url.searchParams.append('year', yr.toString());
        }
        console.log('setting history to', url.toString());
        window.history.pushState(null, '', url.toString());
      }, 50);
    }
  };

  useEffect(() => {
    if (lyr && show) {
      const map = context.map;
      const url = new URL(window.location.href);
      if (
        url.searchParams.has('op') &&
        url.searchParams.get('op') === 'screenshot'
      ) {
        setIsSh(true);
        if (url.searchParams.has('year')) {
          const y = url.searchParams.get('year');
          if (y) {
            setTimeout(() => {
              setCurrYear(parseInt(y), mode);
            }, 1250);
          }
        }
      }

      // @ts-ignore
      map.timeDimension.on('timeloading', cdata => {
        const url = new URL(window.location.href);
        if (
          url.searchParams.has('op') &&
          url.searchParams.get('op') === 'screenshot'
        ) {
          setIsSh(true);
          if (url.searchParams.has('year')) {
            const y = url.searchParams.get('year');
            if (y) {
              setTimeout(() => {
                setCurrYear(parseInt(y), mode);
              }, 1250);
            }
          }
        } else {
          if (!yearSet) {
            let dt = new Date(+cdata.time).getFullYear();
            setCurrYear(dt, data);
          }
          //setTimeout(() => {
          //  let layers = document.getElementsByClassName('leaflet-layer');
          //  let tx = false;
          //  //@ts-ignore
          //  for (const t of layers) {
          //    if (t.style.display === 'none') {
          //      tx = true;
          //    }
          //  }
          //
          //  if (tx) {
          //    let first = true;
          //    //@ts-ignore
          //    for (const t of layers) {
          //      if (t.style['z-index'] === '500') {
          //        if (t.innerHTML.indexOf('time=' + (dt - 1).toString()) >= 0) {
          //          t.style.display = 'block';
          //        } else {
          //          t.style.display = 'none';
          //        }
          //      }
          //    }
          //  }
          //}, 250);
        }
      });
      // @ts-ignore
      //if (!map.setupFrontLayer) map.setupFrontLayer = setupFrontLayer;
      // @ts-ignore
      //map.selected_path = selected_map.path;
      // @ts-ignore
      const selected_map_path = lyr;
      if (selected_map_path) {
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
          verbose: true,
        };
        const options = {
          opacity: opacity,
          zIndex: zIndex,
          display: true,
          attribution:
            '&copy; <a target="_blank" rel="noopener" href="/data">ARPAV - Arpa FVG</a>',
        };
        const tlUrl = selected_map_path; //`${BACKEND_WMS_BASE_URL}/${selected_map_path}`;
        // @ts-ignore
        const wmsLayer = new TileLayer.WMS(tlUrl, {
          ...params,
          ...withPane(options, { __version: 1, map: context.map }),
        });

        let currentLayer: any = null;

        if (selected_map_path && isTimeseries) {
          // @ts-ignore
          const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
            requestTimeFromCapabilities: false,
            updateTimeDimension: false,
            updateTimeDimensionMode: 'replace',
            getCapabilitiesParams: { verbose: 'true' },
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
            currentLayer = tdWmsLayer;
            setTLayer(tdWmsLayer);
            map.addLayer(tdWmsLayer);
            map.removeLayer(tdWmsLayer);
          }

          //const wmsLayer_tmp = new TileLayer.WMS(
          //  tlUrl.replace('winter', 'summer'),
          //  {
          //    ...params,
          //    ...withPane(options, { __version: 1, map: context.map }),
          //  },
          //);
          ////@ts-ignore
          //const tdWmsLayer_tmp = L.timeDimension.layer.wms(wmsLayer_tmp, {
          //  requestTimeFromCapabilities: false,
          //  updateTimeDimension: false,
          //  updateTimeDimensionMode: 'replace',
          //  period: 'P1Y',
          //  getCapabilitiesParams: { verbose: 'true' },
          //  cache: 0,
          //  cacheBackward: 0,
          //  cacheForward: 0,
          //});
          //if (tdWmsLayer_tmp) {
          //  setLayer(tdWmsLayer_tmp);
          //  try {
          //    // @ts-ignore
          //    map._controlContainer.getElementsByClassName(
          //      'leaflet-bar-timecontrol',
          //    )[0].style.display = 'flex';
          //    // @ts-ignore
          //    map._controlContainer.getElementsByClassName(
          //      'leaflet-time-info',
          //    )[0].style.display = 'flex';
          //    setTimestatus('flex');
          //  } catch (e) {
          //    // console.log(e)
          //  }
          //  layer.current = tdWmsLayer_tmp;
          //  currentLayer = tdWmsLayer_tmp;
          //  setTLayer(tdWmsLayer_tmp);
          //  map.addLayer(tdWmsLayer_tmp);
          //  map.removeLayer(tdWmsLayer_tmp);
          //}
          // @ts-ignore
          const tdWmsLayer2 = L.timeDimension.layer.wms(wmsLayer, {
            requestTimeFromCapabilities: false,
            updateTimeDimension: false,
            getCapabilitiesParams: { verbose: 'true' },
            cache: 0,
            cacheBackward: 0,
            cacheForward: 0,
          });

          if (currentMap === 'annual') {
            setLayer(tdWmsLayer2);
            if (!isSh) {
              setTimeout(() => {
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
              }, 250);
            } else {
              setTimeout(() => {
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
              }, 250);
            }
            layer.current = tdWmsLayer2;
            currentLayer = tdWmsLayer2;
            setTLayer(tdWmsLayer2);
            map.addLayer(tdWmsLayer2);
          }
        } else {
          setLayer(wmsLayer);
          setTimeout(() => {
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
          }, 250);
          layer.current = wmsLayer;
          currentLayer = wmsLayer;
          setTLayer(wmsLayer);
          //}
          map.addLayer(wmsLayer);
        }

        return () => {
          map.removeLayer(currentLayer);
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
    currentMap,
    isSh,
  ]);

  return null;
};
