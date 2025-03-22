import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { point } from "leaflet";
import PopUpContent from "./PopUpContent";
import AuthService from "../../services/authService";

const { BaseLayer } = LayersControl;

// Static colors for each category
const categoryColors = {
  business: "#3498DB ",
  crime: "#34495E",
  environment: "#27AE60",
  politics: "#E74C3C",
  science: "#9B59B6",
  sports: "#F1C40F",
  technology: "#2980B9",
  world: "#7F8C8D",
};

// Generate a custom Leaflet icon with a colored marker
const createCustomIcon = (category) => {
  const color = categoryColors[category] || "gray";
  const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40" fill="${color}">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.25 3.578 11.184 10.682 18.368a2 2 0 002.637 0C20.421 23.185 24 17.25 24 12c0-6.627-5.373-12-12-12zm0 18a6 6 0 110-12 6 6 0 010 12z"/>
    </svg>
  `)}`;

  return L.icon({
    iconUrl,
    iconSize: [24, 40],
    iconAnchor: [12, 40],
    popupAnchor: [0, -40],
    shadowUrl: null,
  });
};

// Create custom cluster icon
const createClusterCustomIcon = (cluster) => {
  return new L.DivIcon({
    html: `<span class="text-white bg-gray-800 flex items-center justify-center h-8 w-8 rounded-full font-bold">${cluster.getChildCount()}</span>`,
    className: "custom-cluster",
    iconSize: point(40, 40, true),
  });
};

export default function App() {
  const [markers, setMarkers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const mapnews = await AuthService.worldMap();
        const allMarkers = mapnews?.news || [];

        // Log invalid markers for debugging
        const invalidMarkers = allMarkers.filter(
          (marker) =>
            !Array.isArray(marker.geocode) ||
            marker.geocode.length !== 2 ||
            typeof marker.geocode[0] !== "number" ||
            typeof marker.geocode[1] !== "number" ||
            isNaN(marker.geocode[0]) ||
            isNaN(marker.geocode[1])
        );

        if (invalidMarkers.length > 0) {
          console.warn("Invalid markers found:", invalidMarkers);
        }

        setMarkers(allMarkers);
      } catch (error) {
        console.log("error map", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 md:flex-row border-t border-gray-600 mt-[-4rem] min-h-[70vh] bg-[#E6E5E1] p-6">
          {/* Map Container */}
          <div className="flex items-center justify-center w-full mb-6 md:mb-0 md:w-[85%]">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={4}
              className="w-full h-[400px] sm:h-[500px] md:h-[70vh] z-0"
            >
              <LayersControl position="topright">
                <BaseLayer checked name="Carto Light">
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">Carto</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                </BaseLayer>
                <BaseLayer name="OpenStreetMap">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </BaseLayer>
                <BaseLayer name="OpenTopoMap">
                  <TileLayer
                    attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  />
                </BaseLayer>
              </LayersControl>

              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
              >
                {markers
                  ?.filter(
                    (marker) =>
                      Array.isArray(marker.geocode) &&
                      marker.geocode.length === 2 &&
                      !isNaN(parseFloat(marker.geocode[0])) &&
                      !isNaN(parseFloat(marker.geocode[1]))
                  )
                  .map((marker, index) => (
                    <Marker
                      key={marker.newsId || index}
                      position={[
                        parseFloat(marker.geocode[0]),
                        parseFloat(marker.geocode[1]),
                      ]}
                      icon={createCustomIcon(marker.category)}
                    >
                      <Popup>
                        <PopUpContent content={marker} />
                      </Popup>
                    </Marker>
                  ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>

          {/* Sidebar (Legend) */}
          <div className="w-full md:w-[15%] bg-[#e6e6e5] p-4 mt-6 md:mt-0 border-[1px] border-black overflow-auto">
            <div className="border border-black/75 flex items-center justify-center w-full mb-4">
              <h2 className="text-lg font-bold text-[#D6043C] text-wrap">
                LEGENDS
              </h2>
            </div>
            <div className="space-y-3">
              {Object.entries(categoryColors).map(([category, color], index) => (
                <div key={index} className="flex items-center">
                  <div
                    style={{
                      backgroundColor: color,
                      width: "30px",
                      height: "20px",
                      marginRight: "8px",
                      border: "2px solid black",
                    }}
                  ></div>
                  <span className="text-md text-gray-700 font-jost font-medium">
                    {category.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
