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

    const [showUncertainty, toggleShowUncertainty] = useState(true);

    return (
        <Box>
            <IconButton
                disabled={!enabled}
                onClick={() => {
                    const un = setShowUncertainty(!currentUncertainty);
                    toggleShowUncertainty(un);
                }}
                aria-label={'cambia visualizzazione'}
            >
                <Tooltip
                    title={
                        showUncertainty
                            ? enabled
                                ? 'Attuale: Con incertezza. Passa a: Senza incertezza'
                                : 'Con incertezza'
                            : 'Attuale: Senza incertezza. Passa a: Con incertezza'
                    }
                >
                    <LensBlur></LensBlur>
                </Tooltip>
            </IconButton>
        </Box>
    );
};
