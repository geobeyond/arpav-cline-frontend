import L from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  position: L.ControlPosition;
  children?: React.ReactNode;
  container?: React.HTMLAttributes<HTMLDivElement>;
  prepend?: boolean;
  className?: string;
  style?: any;
}

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

const Control = (props: Props): JSX.Element => {
  const [portalRoot, setPortalRoot] = React.useState<any>(
    document.createElement('div'),
  );
  const positionClass =
    (props.position && POSITION_CLASSES[props.position]) ||
    POSITION_CLASSES.topright;
  const portalContainer = document.createElement('div');

  React.useEffect(() => {
    const targetDiv = document.getElementsByClassName(positionClass);
    setPortalRoot(targetDiv[0]);
  }, [positionClass]);

  if (props.prepend !== undefined && props.prepend === true) {
    portalRoot.prepend(portalContainer);
  } else {
    portalRoot.append(portalContainer);
  }

  let className =
    (props.container?.className?.concat(' ') || '') + 'leaflet-control';
  if (props.className) className += props.className;
  const container = { ...props.container, className, style: props.style };
  const controlContainer = <div {...container}>{props.children}</div>;

  L.DomEvent.disableClickPropagation(portalRoot);

  return ReactDOM.createPortal(controlContainer, portalContainer);
};

export default Control;
