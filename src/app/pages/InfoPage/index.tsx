import { Box, Grid, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import PageContainer from '../../components/Modals/PageContainer';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import HeaderBar from 'app/components/HeaderBar';
import { useTranslation } from 'react-i18next';
import InfoHistoricIt from './InfoHistoricIt';
import InfoForecastIt from './InfoForecastIt';
import InfoForecastEn from './InfoForecastEn';
import InfoHistoricEn from './InfoHistoricEn';
import InfoBaroIt from './InfoBaroIt';
import InfoBaroEn from './InfoBaroEn';
import IntroEn from './IntroEn';
import IntroIt from './IntroIt';

const regioneImg = '../../../assets/img/logo_regione_veneto.png';
const arpafvg = '../../../assets/img/arpafvg-logo.svg';
const arpavImg = '../../../assets/img/logo_arpav.png';
const snpaImg = '../../../assets/img/logo_SNPA.png';

interface TabPanelProps {
    children?: React.ReactNode;
    mode: string;
    value: string;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, mode, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== mode}
            id={`simple-tabpanel-${mode}`}
            aria-labelledby={`simple-tab-${mode}`}
            {...other}
        >
            {value === mode && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const InfoPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const style = {
        maxHeight: isMobile ? '10vh' : '5vh',
        minHeight: '30px',
        marginBottom: '30px',
    };
    const styleSquared = {
        maxHeight: isMobile ? '16vh' : '7vh',
        minHeight: '30px',
        marginBottom: '30px',
    };

    const { t, i18n } = useTranslation();
    const [value, setValue] = React.useState('barometer');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <PageContainer>
            <>
                {i18n.language === 'it' ? <IntroIt /> : <IntroEn />}

                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label={t('app.index.sections.barometer')} value="barometer" />
                    <Tab label={t('app.index.sections.hist')} value="historic" />
                    <Tab label={t('app.index.sections.proj')} value="forecast" />
                </Tabs>

                <CustomTabPanel value={value} mode="forecast">
                    {i18n.language === 'it' ? <InfoForecastIt /> : <InfoForecastEn />}
                </CustomTabPanel>
                <CustomTabPanel value={value} mode="historic">
                    {i18n.language === 'it' ? <InfoHistoricIt /> : <InfoHistoricEn />}
                </CustomTabPanel>
                <CustomTabPanel value={value} mode="barometer">
                    {i18n.language === 'it' ? <InfoBaroIt /> : <InfoBaroEn />}
                </CustomTabPanel>
                <br />
            </>
        </PageContainer>
    );
};

export default InfoPage;
