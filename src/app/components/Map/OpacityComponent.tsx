import React, { useEffect, useState } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { Layer } from 'leaflet';
import { Box, Slider, Stack, Typography } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useDispatch, useSelector } from 'react-redux';
import { Filters, MapState } from '../../pages/MapPage/slice/types';
import { useMapSlice } from '../../pages/MapPage/slice';
import { t } from 'i18next';

export const OpacityComponent = (param: any) => {
  const doSetOpacity = param.doSetOpacity;
  const opacity = param.opacity;
  const context = useLeafletContext();
  const dispatch = useDispatch();
  const actions = useMapSlice();

  //const [opacity, setOpacity] = useState<number>();

  return (
    <Box sx={{ width: 120 }}>
      <Stack spacing={2} direction="row" alignItems="center">
        <OpacityIcon color="secondary" />
        <Slider
          size="small"
          color="secondary"
          aria-label={t('app.map.opacity')}
          value={opacity}
          // @ts-ignore
          onChange={(e, v) => {
            //setOpacity(parseFloat(v.toString()));
            setTimeout(() => {
              doSetOpacity(parseFloat(v.toString()));
            }, 200);
          }}
          step={0.05}
          // marks
          min={0}
          max={1}
        />
      </Stack>
    </Box>
  );
};
