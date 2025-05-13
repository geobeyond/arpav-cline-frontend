import L from 'leaflet';
import { Circle, CircleMarker, Popup, Pane, useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useLeafletContext, withPane } from '@react-leaflet/core';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet.vectorgrid';
import { BACKEND_VECTOR_TILES_URL } from '../../../utils/constants';

import { Button, Paper, Box, IconButton, Typography } from '@mui/material';
import { MapPopup } from '../MapSearch';

import { PopupStyle } from './styles';

export const DynamicStationsLayer = (props: any) => {
  const {
    selectCallback,
    selectedPoint,
    openCharts,
    zIndex,
    variable,
    data,
    url,
  } = props;
  const map = useMap();
  const context = useLeafletContext();
  // console.log(context.map.latLngToLayerPoint(selectedPoint.latlng))
  // const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    let selected = false;
    // let hovered = false;
    const container = context.layerContainer || context.map;

    if (url) {
      context.map.createPane('stationssel');
      // @ts-ignore
      context.map.getPane('stationssel').style.zIndex = zIndex;

      let ln = url.split('/')[4];

      const vtlstyles = {};
      vtlstyles[ln] = (properties, zoom, geometryDimension) => {
        // console.log(zoom, color, opacity)
        return {
          color: '#abb2b9',
          weight: 2,
          radius: 5,
          fill: true,
          fillOpacity: 0.7,
          opacity: 0.9,
        };
      };

      // @ts-ignore
      let vectorLayer = L.vectorGrid.protobuf(url, {
        interactive: true,
        pane: 'stationssel',
        vectorTileLayerStyles: vtlstyles,
      });

      context.map.addLayer(vectorLayer);
      vectorLayer.bringToFront();

      return () => {
        // console.log('RETURN')
        try {
          // @ts-ignore
          if (vectorLayer) container.removeLayer(vectorLayer);
        } catch (e) {
          console.log('error REMOVING', e);
        }
      };
    }
  }, [
    map,
    selectedPoint,
    context.layerContainer,
    context.map,
    selectCallback,
    url,
    zIndex,
    data,
  ]);

  return (
    selectedPoint && (
      <Pane name="custom" style={{ zIndex: 1000 }}>
        <CircleMarker
          center={[selectedPoint.latlng.lat, selectedPoint.latlng.lng]}
          radius={2}
          pathOptions={{ color: '#164d36' }}
        >
          <Popup>
            <Box sx={PopupStyle}></Box>
          </Popup>
        </CircleMarker>
      </Pane>
    )
  );
};
