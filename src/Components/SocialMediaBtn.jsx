import React from 'react';
import { GrFacebookOption } from "react-icons/gr";
import { FaXTwitter, FaWhatsapp, FaPinterestP } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";  
export default function SocialMediaBtn() {
  return (
    <div className='flex gap-3 mt-5'>
      {/* Facebook Icon */}
      <a href="https://www.facebook.com/SamachaarAi" target="_blank" rel="noopener noreferrer">
        <div className="bg-[#353535] h-8 w-8 flex items-center justify-center rounded-full">
          <GrFacebookOption className='text-white text-lg' />
        </div>
      </a>

      {/* Twitter Icon */}
      <a href="https://x.com/SamachaarAi01" target="_blank" rel="noopener noreferrer">
        <div className="bg-[#353535] h-8 w-8 flex items-center justify-center rounded-full">
          <FaXTwitter className='text-white text-lg' />
        </div>
      </a>

      {/* Pinterest Icon */}
      <a href="https://www.pinterest.com/SamachaarAi" target="_blank" rel="noopener noreferrer">
        <div className="bg-[#353535] h-8 w-8 flex items-center justify-center rounded-full">
          <FaPinterestP className='text-white text-lg' />
        </div>
      </a>

      {/* LinkedIn Icon */}
      <a href="https://www.linkedin.com/in/samachaar-ai-38b671343/" target="_blank" rel="noopener noreferrer">
        <div className="bg-[#353535] h-8 w-8 flex items-center justify-center rounded-full">
          <FaLinkedin className='text-white text-lg' />
        </div>
      </a>

      {/* WhatsApp Icon */}
      <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer">
        <div className="bg-[#353535] h-8 w-8 flex items-center justify-center rounded-full">
          <FaWhatsapp className='text-white text-lg' />
        </div>
      </a>
    </div>
  );
}
