"use client";

import { useState, useEffect, useMemo } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
  useMapEvent,
} from "react-leaflet";
import { logout, getPostsInBounds } from "@/app/lib/actions";
import Link from "next/link";
import Modal from "react-modal";
import TemporaryDrawer from "./TemporaryDrawer";
import { CameraIcon, SearchIcon } from "lucide-react";
import { Icon } from "leaflet";

const myLocation = new Icon({
  iconUrl: "https://img.icons8.com/fluency/48/region-code.png",
  iconSize: [52, 52],
  iconAnchor: [52 / 2, 52],
  popupAnchor: [0, -52 / 2],
});

const markerGeneral = new Icon({
  iconUrl: "https://img.icons8.com/glyph-neue/64/marker--v1.png",
  iconSize: [52, 52],
  iconAnchor: [52 / 2, 52],
  popupAnchor: [0, -52 / 2],
});

export function ChangeView({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}

function GetBounds() {
  const [ne, setNe] = useState(null);
  const [sw, setSw] = useState(null);
  const map = useMapEvent({
    dragend: () => {
      const bounds = map.getBounds();
      console.log({ ne: bounds.getNorthEast(), sw: bounds.getSouthWest() });
      setNe(bounds.getNorthEast());
      setSw(bounds.getSouthWest());
    },
    zoomend: () => {
      const bounds = map.getBounds();
      console.log({ ne: bounds.getNorthEast(), sw: bounds.getSouthWest() });
      setNe(bounds.getNorthEast());
      setSw(bounds.getSouthWest());
    },
  });

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (ne && sw) {
      fetch("/api/markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ne, sw }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the data (array of posts)
          setMarkers(data);
        })
        .catch((error) => {
          console.error("Error fetching markers:", error);
        });
    }
  }, [ne, sw]);

  return (
    <div>
      {markers.map((marker) => (
        <Marker
          className="z-0"
          key={marker.post_id}
          position={[marker.coordinates.x, marker.coordinates.y]}
          icon={markerGeneral}
        >
          <Popup>
            <Link
              href={`/post/${marker.post_id}`}
              className="text-2xl font-bold"
            >
              {marker.title}
            </Link>
          </Popup>
        </Marker>
      ))}
    </div>
  );
}


export default function Map() {
  const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });
  const [mapZoom, setMapZoom] = useState(12);
  const [bounds, setBounds] = useState(null);

  const eventHandlers = useMemo(() => ({
    dragend(e) {
      const out = e.target.getLatLng();
      setGeoData({
        lat: out.lat,
        lng: out.lng,
      });
    },
  }));

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
    console.log("GeoData changed:", geoData);
  }, [geoData]);

  const center = [geoData.lat, geoData.lng];

  return (
    <div>
      <div>
        <form className="leaflet-control m-10 mx-auto z-40 w-full flex justify-center items-center overflow-x-auto">
          {/* <button
            formAction={logout}
            className="input-shadow  text-l border bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-xl m-2"
          >
            ⚠️ Logout ⚠️
          </button> */}
          <Link href={`/home/newpost?lat=${geoData.lat}&lng=${geoData.lng}`}>
            <button
              type="button"
              className=" text-l bg-purple-500 border hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl m-2 input-shadow "
            >
              <CameraIcon />
            </button>
          </Link>
          <input
            type="text"
            placeholder="Search"
            className="w-100 p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 m-2"
          />
          <button
            type="button"
            className="input-shadow  border text-l bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl m-2"
          >
            <SearchIcon />
          </button>
        </form>
      </div>
      <TemporaryDrawer />
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
            className="z-2"
            position={[geoData.lat, geoData.lng]}
            draggable={true}
            animate={true}
            eventHandlers={eventHandlers}
            icon={myLocation}
          >
            <Popup>
              <span>You are here</span>
            </Popup>
          </Marker>
        )}

        {/* put text on top max z index */}
        <ChangeView coords={center} zoom={mapZoom} />
        <GetBounds />
      </MapContainer>
    </div>
  );
}
