import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { WMS_PROXY_URL, V2_WMS_PROXY_URL } from '../../../utils/constants';
import { LegendBarStyle } from './styles';

export interface LegendBarProps {
  className?: string;
  isMobile: Boolean;
}

export const LegendBar = (props: LegendBarProps) => {
  const { className, isMobile } = props;
  const { selected_map } = useSelector((state: any) => state.map);

  return (
    <Box className={className} sx={LegendBarStyle}>
      {selected_map.id && (
        <div style={{ backgroundColor: 'white' }}>
          <img
            src={`${V2_WMS_PROXY_URL}${selected_map.legend}`}
            alt={'Legenda'}
          />
          <Typography
            id="modal-modal-title"
            variant="body1"
            component="p"
            align={'center'}
          >
            {selected_map.unit}
          </Typography>
        </div>
      )}
    </Box>
  );
};
