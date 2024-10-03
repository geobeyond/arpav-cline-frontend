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

const lightOrDark = color => {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return 'light';
  } else {
    return 'dark';
  }
};

export const LegendBar = (props: LegendBarProps) => {
  const { className, isMobile, unit } = props;
  const data = props.data || { color_entries: [] };
  const colors = data.color_entries;

  const hex2rgb = c => `rgb(${c.match(/\w\w/g).map(x => +`0x${x}`)})`;

  return (
    <Box className={className}>
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          { colors.length > 0 &&
          <div
            style={{
              backgroundColor: '#' + colors[0].color.substring(3),
              width: isMobile ? '60px' : '120px',
              height: '30px',
            }}
          ></div>}
          {colors.map((itm, index, elements) => {
            const bg = '#' + itm.color.substring(3);
            const hbg = hex2rgb(itm.color.substring(3));
            let nbg = bg;
            let nhbg = hbg;
            if(index < colors.length-1){
              nbg = '#' + elements[index + 1].color.substring(3);
              nhbg = hex2rgb(elements[index + 1].color.substring(3));
            }
            const fg = lightOrDark(bg) === 'light' ? '#000000' : '#ffffff';
            return (
              <div
                style={{
                  display: 'block',
                  width: isMobile ? '60px' : '120px',
                  height: '40px',
                  textAlign: 'right',
                  paddingRight: '5px',
                  lineHeight: '0px',
                  background:
                    'linear-gradient(180deg, ' + bg + ' 0%, ' + nbg + ' 100%)',
                  color: fg,
                }}
              >
                {itm.value.toFixed(1).replaceAll('.', ',')} {unit}
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
};
