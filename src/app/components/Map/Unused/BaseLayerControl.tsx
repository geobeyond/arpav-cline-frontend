import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { useEffect } from 'react';
import 'leaflet-timedimension';
import 'leaflet/dist/leaflet.css';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css';

export const BaseLayerControl = (props: any) => {
  const context = useLeafletContext();
  const baselayers = {
    OpenStreetMap: L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      },
    ),
    'Sentinel 2': L.tileLayer(
      'https://tiles.maps.eox.at/wmts?layer=s2cloudless-2021_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}',
      {
        attribution:
          '&copy; <a target="_blank" rel="noopener" href="https://tiles.maps.eox.at/">Sentinel-2 cloudless by EOX IT Services GmbH (Copernicus Sentinel data 2017 &amp; 2018)</a>',
      },
    ),
    Gebco: L.tileLayer.wms(
      'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
      {
        layers: 'GEBCO_LATEST',
        format: 'image/png',
        attribution:
          '&copy; <a target="_blank" rel="noopener" href="https://tiles.maps.eox.at/">Sentinel-2 cloudless by EOX IT Services GmbH (Copernicus Sentinel data 2017 &amp; 2018)</a>',
      },
    ),
  };

  useEffect(() => {
    // @ts-ignore
    const layercontrols = L.control.layers(baselayers, {});
    layercontrols.addTo(context.map);
    return () => {
      layercontrols && layercontrols.remove();
    };
  }, []);

  return null;
};
