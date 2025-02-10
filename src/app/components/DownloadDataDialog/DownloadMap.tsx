import {
  MapContainer,
  Pane,
  Rectangle,
  TileLayer,
  useMap,
  FeatureGroup,
} from 'react-leaflet';
import { LatLngBounds, LatLng, Layer } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

export const DownloadMap = ({
  mapBounds,
  downLoadBounds,
  featureGroupRef,
  setBoundsFromMap,
  resetBounds,
}) => {
  const limitBounds = bounds => {
    return new LatLngBounds(
      new LatLng(
        Math.min(bounds._northEast.lat, mapBounds[1][0]),
        Math.min(bounds._northEast.lng, mapBounds[1][1]),
      ),
      new LatLng(
        Math.max(bounds._southWest.lat, mapBounds[0][0]),
        Math.max(bounds._southWest.lng, mapBounds[0][1]),
      ),
    );
  };

  const _onCreate = (layer: Layer) => {
    // rimuovo eventuali layer creati in precedenza
    if (Array.isArray(featureGroupRef?.current?.getLayers())) {
      if (featureGroupRef?.current?.getLayers().length > 1) {
        featureGroupRef?.current?.removeLayer(
          featureGroupRef?.current?.getLayers()[0],
        );
      }
    }

    let bounds: LatLngBounds = featureGroupRef?.current?.getBounds();
    bounds = limitBounds(bounds);
    setBoundsFromMap(bounds);
  };

  const _onEdited = (layer: Layer) => {
    let bounds: LatLngBounds = featureGroupRef?.current?.getBounds();
    bounds = limitBounds(bounds);
    setBoundsFromMap(bounds);
  };

  const _onDeleted = (layer: Layer) => {
    resetBounds();
  };

  return (
    <MapContainer
      center={[45.9, 12.45]}
      zoom={6}
      maxZoom={14}
      style={{ height: '320px', width: '100%', minWidth: '320px' }}
    >
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={_onCreate}
          onEdited={_onEdited}
          onDeleted={_onDeleted}
          draw={{
            rectangle: { repeatMode: false },
            polyline: false,
            polygon: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
      </FeatureGroup>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*<BlinkingPane/>*/}
      <Pane name="yellow-rectangle" style={{ zIndex: 500 }}>
        <Rectangle bounds={mapBounds} pathOptions={{ color: 'grey' }} />
        <Rectangle bounds={downLoadBounds} pathOptions={{ color: 'yellow' }} />
      </Pane>
    </MapContainer>
  );
};
