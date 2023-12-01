"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// import { createNewPost } from "@/app/lib/actions";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const searchParams = useSearchParams();
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  const loc = useMemo(() => ({
    lat: searchParams.get("lat") || manualLat,
    lng: searchParams.get("lng") || manualLng
  }), [searchParams, manualLat, manualLng]);

  

//   const loc = { lat: searchParams.get("lat"), lng: searchParams.get("lng") };

  const isLocationValid = useMemo(() => {
    const lat = parseFloat(loc.lat);
    const lng = parseFloat(loc.lng);
    return !isNaN(lat) && !isNaN(lng);
  }, [loc.lat, loc.lng]);

  const handleImageChange = (e) => {
    const selectedFiles = [...e.target.files];
    // Append new images to the existing array
    setImages((prevImages) => [...prevImages, ...selectedFiles]);

    // Generate and append new image previews
    const newImagePreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white mx-auto rounded-xl px-8 pt-6 pb-8 mb-4 shadow-lg w-full max-w-sm">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          />
        </div>
        <div className="mb-4 flex content-center items-center">
        {isLocationValid ? (
          <div className="mb-4 flex content-center">
            <div>
              <p>Latitude: {loc.lat}</p>
              <p>Longitude: {loc.lng}</p>
              <MapContainer
                className="relative"
                center={[loc.lat, loc.lng]}
                zoom={12}
                style={{ height: "200px", width: "200px" }}
              >
                <TileLayer
                  className="z-0"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  maxZoom={20}
                />
                {loc.lat && loc.lng && (
                  <Marker className="z-0" position={[loc.lat, loc.lng]} draggable={false}>
                    <Popup>
                      <span>You are here</span>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        ) : (
            <div className="mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="Enter latitude"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="Enter longitude"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="flex flex-wrap mt-2">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover p-1"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center content-center justify-center">
          <button
            type="submit"
            className=" text-l bg-purple-500 border hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2 input-shadow"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
