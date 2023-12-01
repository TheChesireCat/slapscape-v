"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import { useState, useEffect } from "react";


export function ChangeView({ coords, zoom }) {
    const map = useMap();
    map.setView(coords, zoom);
    return null;
  }

export default function Map() {
    const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });
    const [mapZoom, setMapZoom] = useState(12);
  
    useEffect(() => {
        // request permission
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setGeoData({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setMapZoom(20);
          });
        }
      }, []);
    const center = [geoData.lat, geoData.lng];
  return (
    <MapContainer
      className="absolute"
      center={center}
      zoom={mapZoom}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        className="z-0"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        maxZoom={20}
      />
      {geoData.lat && geoData.lng && (
        <Marker
          className="z-0"
          position={[geoData.lat, geoData.lng]}
        >
        </Marker>
      )}

      {/* put text on top max z index */}
      <ChangeView coords={center} zoom={mapZoom} />
    </MapContainer>
  );
}
