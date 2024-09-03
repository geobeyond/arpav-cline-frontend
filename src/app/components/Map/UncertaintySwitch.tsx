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
    Typography,
} from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useDispatch, useSelector } from 'react-redux';
import { Filters, MapState } from '../../pages/MapPage/slice/types';
import { useMapSlice } from '../../pages/MapPage/slice';
import { LensBlur } from '@mui/icons-material';

export const UncertaintySwitch = props => {
    const setShowUncertainty = props.setShowUncertainty;
    const context = useLeafletContext();
    const dispatch = useDispatch();
    const actions = useMapSlice();
    const { opacity } = useSelector(state => (state as any).map as MapState);

    const [showUncertainty, toggleShowUncertainty] = useState(true);

    return (
        <Box>
            <IconButton
                onClick={() => {
                    toggleShowUncertainty(!showUncertainty);
                    setShowUncertainty(showUncertainty);
                }}
                aria-label={'cambia visualizzazione'}
            >
                <LensBlur></LensBlur>
            </IconButton>
        </Box>
    );
};
