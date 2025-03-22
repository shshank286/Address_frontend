import React from 'react';
import WhiteLogoImage from '../assets/images/whitelogo.png'; 

const WhiteLogo = () => {
  return (
    <div className="absolute top-5 left-4">
      <img src={WhiteLogoImage} alt="Logo" className="h-5 sm:h-7" />
    </div>
  );
};

export default WhiteLogo;

