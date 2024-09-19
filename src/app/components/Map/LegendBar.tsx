import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { WMS_PROXY_URL, V2_WMS_PROXY_URL } from '../../../utils/constants';

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
    <Box className={className}>
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.color_entries.map(itm => {
            return (
              <div
                style={{
                  display: 'block',
                  width: isMobile ? '60px' : '120px',
                  height: '20px',
                  textAlign: 'right',
                  paddingRight: '5px',
                  backgroundColor: itm.color,
                }}
              >
                {itm.value} {unit}
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
};
