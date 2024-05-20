import L from 'leaflet'

const createCustomIcon = (imageUrl) => {
    return L.icon({
      iconUrl: imageUrl,
      iconSize: [37, 41], // size of the icon
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
      shadowSize: [41, 41] // size of the shadow
    });
  };

export default createCustomIcon;