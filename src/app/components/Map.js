"use client";

import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'

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
import Link from "next/link";
import TemporaryDrawer from "./TemporaryDrawer";
import { CameraIcon, SearchIcon } from "lucide-react";
import { Icon } from "leaflet";
import { Snackbar, Alert } from "@mui/material";
import { GpsNotFixed } from "@mui/icons-material";

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
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const map = useMapEvent({
    dragend: () => {
      const bounds = map.getBounds();
      // console.log({ ne: bounds.getNorthEast(), sw: bounds.getSouthWest() });
      setNe(bounds.getNorthEast());
      setSw(bounds.getSouthWest());
    },
    zoomend: () => {
      const bounds = map.getBounds();
      // console.log({ ne: bounds.getNorthEast(), sw: bounds.getSouthWest() });
      setNe(bounds.getNorthEast());
      setSw(bounds.getSouthWest());
    },
  });

  const [markers, setMarkers] = useState([]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    setNe(map.getBounds().getNorthEast());
    setSw(map.getBounds().getSouthWest());
  }, []);

  useEffect(() => {
    if (ne && sw) {
      setIsFetchingData(true);
      setSnackbarOpen(true);
      fetch("/api/markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/sjson",
        },
        body: JSON.stringify({ ne, sw }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsFetchingData(false);
          setSnackbarOpen(false);
          setMarkers(data);
        })
        .catch((error) => {
          console.error("Error fetching markers:", error);
        });
    }
  }, [ne, sw]);

  const ne_ = map.getBounds().getNorthEast();
  const sw_ = map.getBounds().getSouthWest();


  return (
    <div>
      {markers.map((marker) => (
        <Marker
          className="z-0 leaflet-bottom"
          key={marker.post_id}
          draggable={false}
          position={[marker.lat,marker.lon]}
          icon={markerGeneral}
        >
          <Popup>
            <Link
              href={`/home/post/${marker.post_id}`}
              className="text-2xl font-bold"
            >
              {marker.title}
            </Link>
          </Popup>
        </Marker>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          {isFetchingData ? "Getting Marker Data..." : "Markers updated"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default function Map() {
  const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });
  const [mapZoom, setMapZoom] = useState(12);
  const [bounds, setBounds] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const eventHandlers = useMemo(() => ({
    dragend(e) {
      const out = e.target.getLatLng();
      setGeoData({
        lat: out.lat,
        lng: out.lng,
      });
    },
  }));


  const fetchLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      setSnackbarOpen(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newGeoData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setGeoData(newGeoData);
          setMapZoom(20);
          Cookies.set("location", JSON.stringify(newGeoData), { expires: 7 }); // Store location in cookies
          Cookies.set("zoom", 20, { expires: 7 });
          setIsFetchingLocation(false);
          setSnackbarOpen(false);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          setIsFetchingLocation(false);
          setSnackbarOpen(false);
        }
      );
    }
  };

  useEffect(() => {
    // const storedLocation = Cookies.get("location");
    // const storedZoom = Cookies.get("zoom");
    // if (storedLocation) {
    //   setGeoData(JSON.parse(storedLocation));
    // }
    // if (storedZoom) {
    //   setMapZoom(storedZoom);
      fetchLocation();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // console.log("GeoData changed:", geoData);
  }, [geoData]);

  const center = [geoData.lat, geoData.lng];

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const  handleClick = () => {
    if (searchQuery) {
      router.push(`/home/search?q=${searchQuery}`);
    }
  };

  

  // useEffect(() => {
  //   console.log("Search query changed:", searchQuery);
  // }, [searchQuery]);


  return (
    <div>
      <div>
        <form className="leaflet-control bg-transparent m-10 mx-auto z-40 w-full flex justify-center items-center overflow-x-auto">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            name="search"
            placeholder="Search"
            className="w-100 p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 m-2"
          />
          <button
            type="button"
            onClick={handleClick}
            className="input-shadow  border text-l bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl m-2"
          >
            <SearchIcon/>
          </button>
          <button
            type="button"
            onClick={fetchLocation}
            className="input-shadow  border text-l bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl m-2"
          >
            <GpsNotFixed />
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
            zIndexOffset={1000}
            className="leaflet-top"
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          {isFetchingLocation ? "Getting location..." : "Location updated"}
        </Alert>
      </Snackbar>
    </div>
  );
}
