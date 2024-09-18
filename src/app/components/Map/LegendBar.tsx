import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { WMS_PROXY_URL, V2_WMS_PROXY_URL } from '../../../utils/constants';
import { LegendBarStyle } from './styles';

export interface LegendBarProps {
  className?: string;
  isMobile: Boolean;
  data: any;
  unit: string;
}

export const LegendBar = (props: LegendBarProps) => {
  const { className, isMobile, unit } = props;
  const data = props.data || { color_entries: [] };

  return (
    <Box className={className} sx={LegendBarStyle}>
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.color_entries.map(itm => {
            <div style={{ display: 'flex', flexDirection: 'row' }}></div>;
          })}
        </div>
        <Typography
          id="modal-modal-title"
          variant="body1"
          component="p"
          align={'center'}
        >
          {unit}
        </Typography>
      </div>
    </Box>
  );
};
