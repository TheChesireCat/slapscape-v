"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// import { createNewPost } from "@/app/lib/actions";

function UpdateMapView({ loc }) {
  const map = useMap();

  useEffect(() => {
    if (loc.lat && loc.lng) {
      map.flyTo([loc.lat, loc.lng], map.getZoom());
    }
  }, [loc, map]);

  return null;
}

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const searchParams = useSearchParams();
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState( []); // Stores the list of fetched tags
  const [tagInput, setTagInput] = useState(''); // Input for creating a new tag

  useEffect(() => {
    // Fetch tags when component mounts
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tagList');
        const data = await response.json();
        console.log(data);
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const createNewTag = async () => {
    try {
      const response = await fetch('/api/tagCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag: tagInput }),
      });

      if (response.ok) {
        setTags(prev => [...prev, tagInput]);
        addTag(tagInput);
        setTagInput(''); // Clear the input field
      } else {
        throw new Error('Failed to create tag');
      }
    } catch (error) {
      console.error('Error creating new tag:', error);
    }
  };


  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat !== null) setManualLat(lat);
    if (lng !== null) setManualLng(lng);
  }, [searchParams]);

  const loc = useMemo(
    () => ({
      lat: manualLat,
      lng: manualLng,
    }),
    [manualLat, manualLng]
  );

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

  const markerDragEventHandlers = useMemo(() => ({
    dragend(e) {
      const out = e.target.getLatLng();
      const newUrl = `${window.location.pathname}?lat=${out.lat}&lng=${out.lng}`;
      window.history.pushState(null, "", newUrl);
      setManualLat(out.lat);
      setManualLng(out.lng);
    },
  }));

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white mx-auto rounded-xl px-8 pt-6 pb-8 mb-4 shadow-lg w-full max-w-sm">
        <div id="title-new-post" className="mb-4">
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
        <div id="description-new-post" className="mb-4">
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
        <div
          id="location-new-post"
          className="mb-4 flex content-center items-center"
        >
          {isLocationValid ? (
            <div className="mb-4 flex justify-center items-center flex-row mx-auto">
              <div>
                <p>Latitude: {loc.lat}</p>
                <p>Longitude: {loc.lng}</p>
                <MapContainer
                  className="relative"
                  center={[loc.lat, loc.lng]}
                  zoom={20}
                  style={{ height: "200px", width: "200px" }}
                >
                  <TileLayer
                    className="z-0"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    maxZoom={20}
                  />
                  {loc.lat && loc.lng && (
                    <Marker
                      className="z-0"
                      position={[loc.lat, loc.lng]}
                      draggable={true}
                      eventHandlers={markerDragEventHandlers}
                    >
                      <Popup>
                        <span>You are here</span>
                      </Popup>
                    </Marker>
                  )}
                  <UpdateMapView loc={loc} />
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
        <div className="mb-4" id="tag-new-post">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <div className="border rounded w-full py-2 px-3 text-gray-700 flex flex-wrap min-h-[40px]">
            {selectedTags.length > 0 ? (
              selectedTags.map(tag => (
                <div key={tag} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mr-2 mb-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-gray-500 hover:text-gray-700">
                    &#215; {/* 'X' symbol */}
                  </button>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Select tags...</span>
            )}
          </div>
          <select onChange={(e) => addTag(e.target.value)} defaultValue="" className="mt-2 shadow border rounded w-full py-2 px-3 text-gray-700">
            <option value="" disabled>Add a tag...</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <div className="flex items-center p-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Create a new tag..."
              className="shadow border rounded w-full py-2 px-3 text-gray-700 mr-2"
            />
            <button
              type="button"
              onClick={createNewTag}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-l"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mb-4" id="imagepreview">
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
