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

import { HeroStyle, TopHeroStyle } from './styles';
import HeaderBar from 'app/components/HeaderBar';
import Graph from './Graph';

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
        <h2>Barometro del clima</h2>

        <i>La temperatura misurata in Veneto e le proiezioni per il futuro</i>

        <p>
          Il barometro utilizza la temperatura media annuale come indicatore
          dell'evoluzione del clima. Nel grafico:
          <ul>
            <li>
              la temperatura registrata sul Veneto negli ultimi decenni (linea
              nera);
            </li>
            <li>
              le proiezioni climatiche fino a fine secolo per tre diversi
              scenari di riduzione delle emissioni di gas serra (linee blu,
              gialla e rossa).
            </li>
          </ul>
        </p>
        <Graph></Graph>
      </Hero>
      <Section></Section>
      <Container color="muted" style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          <Col sm={6}>
            <Hero overlay="dark" style={HeroStyle}>
              <HeroBackground
                alt="imagealt"
                src={require('../../../assets/img/puntapenia_1937.jpg')}
                title="image title"
              />
              <HeroBody>
                <HeroTitle>{t('app.index.sections.hist')}</HeroTitle>
                <p className="d-none d-lg-block"></p>
                <HeroButton disabled={true} href="/ps" color="secondary">
                  {t('app.index.sections.simple')}
                </HeroButton>
                <br />
                <br />
                <br />
                <HeroButton disabled={true} href="/pa" color="secondary">
                  {t('app.index.sections.advanced')}
                </HeroButton>
              </HeroBody>
            </Hero>
          </Col>
          <Col sm={6}>
            <Hero overlay="dark" style={HeroStyle}>
              <HeroBackground
                alt="imagealt"
                src={require('../../../assets/img/punta_penia2022_cielo2.jpg')}
                title="image title"
              />
              <HeroBody>
                <HeroTitle>{t('app.index.sections.proj')}</HeroTitle>
                <p className="d-none d-lg-block"></p>
                <HeroButton disabled={true} href="fs" color="secondary">
                  {t('app.index.sections.simple')}
                </HeroButton>
                <br />
                <br />
                <br />
                <HeroButton href="fa" color="secondary">
                  {t('app.index.sections.advanced')}
                </HeroButton>
              </HeroBody>
            </Hero>
          </Col>
        </Row>
      </Container>
      <hr></hr>
      <HeaderBar></HeaderBar>
    </>
  );
};

export default IndexPage;
