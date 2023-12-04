import L from 'leaflet';

const iconPerson = new L.Icon({
    iconUrl: 'public/ko.svg',
    iconRetinaUrl: 'public/ko.svg',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-div-icon'
});

export { iconPerson };