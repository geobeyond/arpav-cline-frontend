import { env } from '../app/config';

export const APP_NAME = process.env.REACT_APP_NAME as string;
export const BACKEND_API_URL = env.ARPAV_BACKEND_API_BASE_URL + '/api/v2';
export const BACKEND_VECTOR_TILES_URL = env.ARPAV_BACKEND_API_BASE_URL + '/vector-tiles';
export const BACKEND_WMS_BASE_URL = BACKEND_API_URL + '/coverages/wms';
export const TOLGEE_BASE_URL = env.ARPAV_TOLGEE_BASE_URL;

// import BloodtypeIcon from '@mui/icons-material/Bloodtype';
