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

export const StationsLayer = (props: any) => {
  const { selectCallback, selectedPoint, openCharts, zIndex, variable, data } =
    props;
  const map = useMap();
  const context = useLeafletContext();
  // console.log(context.map.latLngToLayerPoint(selectedPoint.latlng))
  // const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    let selected = false;
    // let hovered = false;
    const container = context.layerContainer || context.map;
    const url = BACKEND_VECTOR_TILES_URL + '/stations/{z}/{x}/{y}';

    context.map.createPane('stations');
    // @ts-ignore
    context.map.getPane('stations').style.zIndex = zIndex;

    // @ts-ignore
    let vectorLayer = L.vectorGrid.protobuf(url, {
      interactive: true,
      pane: 'stations',
      vectorTileLayerStyles: {
        stations: (properties, zoom, geometryDimension) => {
          // console.log(zoom, color, opacity)
          return {
            color: '#bdc2cf',
            weight: 1,
            radius: 3,
            fill: true,
            fillOpacity: 0.7,
            opacity: 0.9,
          };
        },
      },
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
  }, [
    map,
    selectedPoint,
    context.layerContainer,
    context.map,
    selectCallback,
    zIndex,
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
