import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationAccessModal from "./LocationAccessModal";
import "react-toastify/dist/ReactToastify.css";
import CardPage from "./CardPage";
import FirstCat from "./FirstCat";
import SecondCat from "./SecondCat";
import LatestArticles from "./LatestArticles";
import Features from "./Features";
import { toast } from "react-hot-toast";

import {
  fetchNews,
  clearNewsByDate,
  fetchNewsByDate,
} from "../../Context/newsSlice";
import { useDispatch, useSelector } from "react-redux";
import NoNewsAvailable from "../NoNewsAvailable";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, loading: newsLoading, selectedDate } = useSelector(
    (state) => state.news || []
  );

  useEffect(() => {
    const granted = localStorage.getItem("locationGranted") === "true";
    if (granted) {
      setLocationGranted(true);
      setShowModal(false);
      setLoading(false);
    } else {
      setLoading(false);
      setShowModal(true);
    }
  }, []);

  const handleAllowLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location granted:", position.coords);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          localStorage.setItem("latitude", position.coords.latitude);
          localStorage.setItem("longitude", position.coords.longitude);

          // Store the state in localStorage
          localStorage.setItem("locationGranted", "true");
          setLocationGranted(true);
          setLocationDenied(false);
          setShowModal(false);
          navigate("/");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationDenied(true);
            toast.error(
              "Location access denied. Please enable location in your browser settings."
            );
          } else {
            toast.error("An error occurred while fetching location.");
          }
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchNewsByDate(selectedDate));
    } else {
      dispatch(clearNewsByDate());
    }
  }, [dispatch, selectedDate]);

  const newsToDisplay =
    selectedDate && Array.isArray(data.byDate) && data.byDate.length > 0
      ? data.byDate
      : Array.isArray(data.all) && data.all.length > 0
      ? data.all
      : [];

  return (
    <div className="relative bg-[#E6E5E1]">
      {/* Render the Modal only if location is not granted */}
      {!locationGranted && showModal && !loading && (
        <LocationAccessModal onAllow={handleAllowLocation} />
      )}

      {newsToDisplay.length === 0 ? (
        <NoNewsAvailable />
      ) : (
        <>
          <div className="mt-[-3.8rem] mb-4">
            <hr className="h-[1.5px] bg-black mb-[3px]" />
            <hr className="h-[1.5px] bg-black" />
          </div>

          <CardPage />
          <FirstCat />
          <hr className="h-[1.5px] w-[64.6%] ml-5 bg-black mb-5 mt-5" />
          <SecondCat />
          <LatestArticles />
          <Features />
        </>
      )}
    </div>
  );
}

export default HomePage;
