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
        <Graph></Graph>
      </Hero>
      <Section></Section>
      <Container color="muted" style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          <Col sm={6}>
            <Hero overlay="dark" style={HeroStyle}>
              <HeroBackground
                alt="imagealt"
                src="https://plus.unsplash.com/premium_photo-1694475170294-4869138cca31?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="image title"
              />
              <HeroBody>
                <HeroTitle>Climatologia storica</HeroTitle>
                <p className="d-none d-lg-block"></p>
                <HeroButton href="/ps" color="secondary">
                  Visualizzazione semplice
                </HeroButton>
                <br />
                <br />
                <br />
                <HeroButton href="/pa" color="secondary">
                  Visualizzazione avanzata
                </HeroButton>
              </HeroBody>
            </Hero>
          </Col>
          <Col sm={6}>
            <Hero overlay="dark" style={HeroStyle}>
              <HeroBackground
                alt="imagealt"
                src="https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="image title"
              />
              <HeroBody>
                <HeroTitle>Proiezioni climatiche</HeroTitle>
                <p className="d-none d-lg-block"></p>
                <HeroButton href="fs" color="secondary">
                  Visualizzazione semplice
                </HeroButton>
                <br />
                <br />
                <br />
                <HeroButton href="fa" color="secondary">
                  Visualizzazione avanzata
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
