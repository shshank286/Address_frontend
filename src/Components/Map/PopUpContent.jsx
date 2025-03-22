import React from "react";
import "./PopUpContent.css";
import { useNavigate } from "react-router-dom";

const PopUpContent = (prop) => {
  const navigate = useNavigate();
  const news = prop.content;

  const handleNewsClick = () => {
    navigate(`/detailspage/${news.newsId}`);
  };
  return (
    <>
      <div className="popup-content" onClick={handleNewsClick}>
        <span>{news.popUp}</span>
        <img src={news.newsImg} alt="News" />
      </div>
    </>
  );
};

export default PopUpContent;
