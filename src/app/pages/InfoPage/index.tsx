import { Grid, Typography, useMediaQuery } from '@mui/material';
import PageContainer from '../../components/Modals/PageContainer';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import HeaderBar from 'app/components/HeaderBar';
import { useTranslation } from 'react-i18next';

const regioneImg = '../../../assets/img/logo_regione_veneto.png';
const arpafvg = '../../../assets/img/arpafvg-logo.svg';
const arpavImg = '../../../assets/img/logo_arpav.png';
const snpaImg = '../../../assets/img/logo_SNPA.png';

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

    const { t } = useTranslation();

    return (
        <PageContainer>
            <>
                <br />

                <div
                    dangerouslySetInnerHTML={{
                        __html:
                            t('app.pages.info.p1') +
                            t('app.pages.info.p2') +
                            t('app.pages.info.p3') +
                            t('app.pages.info.p4') +
                            t('app.pages.info.p5'),
                    }}
                />
            </>
        </PageContainer>
    );
};

export default InfoPage;
