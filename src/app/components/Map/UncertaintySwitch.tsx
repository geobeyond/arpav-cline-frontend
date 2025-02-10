import React, { useEffect, useState } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { Layer } from 'leaflet';
import {
    Box,
    Button,
    Fab,
    IconButton,
    Slider,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useDispatch, useSelector } from 'react-redux';
import { Filters, MapState } from '../../pages/MapPage/slice/types';
import { useMapSlice } from '../../pages/MapPage/slice';
import { LensBlur } from '@mui/icons-material';

export const UncertaintySwitch = props => {
    const setShowUncertainty = props.setShowUncertainty;
    const currentUncertainty = props.currentUncertainty;
    const enabled = props.enabled || true;
    const context = useLeafletContext();
    const dispatch = useDispatch();
    const actions = useMapSlice();
    const { opacity } = useSelector(state => (state as any).map as MapState);

    return (
        <Box>
            <IconButton
                onClick={() => {
                    setShowUncertainty(!currentUncertainty);
                }}
                aria-label={'cambia visualizzazione'}
            >
                <Tooltip
                    title={
                        currentUncertainty
                            ? enabled
                                ? 'Aree incertezza: ON'
                                : 'Con incertezza'
                            : 'Aree incertezza: OFF'
                    }
                    enterTouchDelay={0}
                >
                    <LensBlur></LensBlur>
                </Tooltip>
            </IconButton>
        </Box>
    );
};
