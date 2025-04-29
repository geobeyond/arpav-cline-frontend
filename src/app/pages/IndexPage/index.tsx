import PageContainer from '../../components/Modals/PageContainer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  Col,
  Container,
  Header,
  HeaderBrand,
  HeaderContent,
  HeaderLinkZone,
  HeaderRightZone,
  HeaderSearch,
  HeaderSocialsZone,
  Headers,
  Hero,
  HeroBackground,
  HeroBody,
  HeroButton,
  HeroCategory,
  HeroTitle,
  Icon,
  LinkList,
  LinkListItem,
  Row,
  Section,
} from 'design-react-kit';

import { AttStyle, HeroStyle, TopHeroStyle, AttributionStyle } from './styles';
import HeaderBar from 'app/components/HeaderBar';
import Graph from './Graph';
import { Box, Typography } from '@mui/material';

const IndexPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const regioneImg = '/img/logo_regione_veneto.png';
  const arpavImg = '/img/logo_arpav.png';
  const snpaImg = '/img/logo_SNPA.png';
  const setIds = newIds => null;
  const setTimeRange = tr => null;

  return (
    <>
      <HeaderBar mode="full"></HeaderBar>

      <Hero overlay="dark" style={TopHeroStyle}>
        <h2>{t('app.index.header.title')}</h2>

        <p>
          <i>{t('app.index.header.subtitle')}</i>
        </p>
        <p>
          {t('app.index.header.descriptor')}

          <ul>
            <li>{t('app.index.header.p1')}</li>
            <li>{t('app.index.header.p2')}</li>
          </ul>
        </p>
        <Graph></Graph>
      </Hero>
      <Section></Section>
      <Container></Container>
      <Container color="muted" style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          <Col lg={12} xl={6}>
            <Hero overlay="dark">
              <HeroBackground
                alt="Giuseppe Ghedina Basilio (1937)"
                src={require('../../../assets/img/puntapenia_1937.jpg')}
                title="Giuseppe Ghedina Basilio (1937)"
              />
              <HeroBody>
                <HeroTitle style={{ paddingRight: '20px' }}>
                  {t('app.index.sections.hist')}
                </HeroTitle>
                <p className="d-none d-lg-block"></p>
                <HeroButton href="/storico-semplice" color="secondary">
                  {t('app.index.sections.simple')}
                </HeroButton>
                <br />
                <br />
                <br />
                <HeroButton href="/storico-avanzata" color="secondary">
                  {t('app.index.sections.advanced')}
                </HeroButton>
              </HeroBody>
            </Hero>
            <Container sx={AttributionStyle}>
              <Box sx={AttributionStyle}>
                <Typography sx={AttStyle}>
                  Giuseppe Ghedina Basilio (1937)
                </Typography>
              </Box>
            </Container>
          </Col>
          <Col lg={12} xl={6}>
            <Hero overlay="dark">
              <HeroBackground
                alt="imagealt"
                src={require('../../../assets/img/punta_penia2022_cielo2.jpg')}
                title="image title"
              />
              <HeroBody>
                <HeroTitle>{t('app.index.sections.proj')}</HeroTitle>
                <p className="d-none d-lg-block"></p>
                <HeroButton href="proiezioni-semplice" color="secondary">
                  {t('app.index.sections.simple')}
                </HeroButton>
                <br />
                <br />
                <br />
                <HeroButton href="proiezioni-avanzata" color="secondary">
                  {t('app.index.sections.advanced')}
                </HeroButton>
              </HeroBody>
            </Hero>
            <Container sx={AttributionStyle}>
              <Box sx={AttributionStyle}>
                <Typography sx={AttStyle}>Mauro Valt (2022)</Typography>
              </Box>
            </Container>
          </Col>
        </Row>
      </Container>
      <hr></hr>
      <HeaderBar></HeaderBar>
    </>
  );
};

export default IndexPage;
