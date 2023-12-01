"use client";

import { useState, useEffect, useMemo } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import { logout } from "@/app/lib/actions";
import Link from "next/link";
import Modal from "react-modal";

export const DraggableMarker = ({ initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          // Here, you can also update the geoData state or lift this state up
        }
      }
    }),
    []
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
      <Popup minWidth={90}>
        <span>You are here</span>
      </Popup>
    </Marker>
  );
};

export function ChangeView({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}
export default function Map() {
  const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });
  const [mapZoom, setMapZoom] = useState(12);

  const eventHandlers = useMemo(()=>(
    {
      dragend(e){
        const out = e.target.getLatLng();
        setGeoData({
          lat: out.lat,
          lng: out.lng
        })
      }
    }
  ));

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

  useEffect(() => {
    console.log('GeoData changed:', geoData);
  }, [geoData]);

  const center = [geoData.lat, geoData.lng];

  return (
    <div>
      <div>
        <form className="leaflet-control m-10 mx-auto z-40 w-full flex justify-center items-center overflow-x-auto">
          <button
            formAction={logout}
            className="input-shadow  text-l border bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            ⚠️ Logout ⚠️
          </button>

          <input
            type="text"
            placeholder="Search"
            className="w-100 p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 m-2"
          />
          <button
            type="button"
            className="input-shadow  border text-l bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            🔎
          </button>
          <Link href={`/home/newpost?lat=${geoData.lat}&lng=${geoData.lng}`}>
          <button
            type="button"
            className=" text-l bg-purple-500 border hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2 input-shadow "
          >
           + New
          </button></Link>
        </form>
      </div>
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
            draggable={true}
            animate={true}
            eventHandlers={eventHandlers}
          >
            <Popup>
              <span>You are here</span>
            </Popup>
          </Marker>
        )}

        {/* put text on top max z index */}
        <ChangeView coords={center} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
}
