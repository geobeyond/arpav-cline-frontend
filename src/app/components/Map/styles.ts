import { Property } from 'csstype';

export const MapContainerStyle = {
  height: '100%',
  width: '100%',
};

export const MousePositionDisplayStyle = theme => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'white',
  width: '16.5em',
  marginRight: '0',

  '&>p': {
    marginTop: '0.7em',
    marginBottom: '0.7em',
  },
});

export const MobileSpaceDisplayStyle = {
  width: '1em',
  height: '1em',
  marginRight: '0',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column' as Property.FlexDirection,
  justifyContent: 'space-between',
  alignItems: 'center',
  // visibility: 'hidden',
  visibility: 'hidden' as Property.Visibility,
};

export const PopupStyle = theme => ({
  width: '108px',
  height: '42px',
});
