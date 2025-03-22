import React from 'react';
import LogoImage from '../assets/images/logo.png'; 

const Logo = () => {
  return (
    <div className="absolute top-5 left-4">
      <img src={LogoImage} alt="Logo" className="h-5 sm:h-7" />
    </div>
  );
};

export default Logo;
