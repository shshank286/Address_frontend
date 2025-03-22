import React from "react";
import PropTypes from "prop-types";  
import Lottie from "react-lottie";
import anim from "../../assets/animation/mapAnim.json";

function LocationAccessModal({ onAllow }) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: anim,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70"
            aria-labelledby="location-access-modal-title"
            role="dialog"
            aria-hidden="false"
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-[450px]" role="document">
                <div className="flex flex-col items-center">
                    {/* Lottie Animation */}
                    <div className="w-32 h-32 mb-4">
                        <Lottie options={defaultOptions} height={128} width={128} />
                    </div>

                    {/* Modal Title */}
                    <h2 id="location-access-modal-title" className="text-lg font-semibold text-gray-800 mb-2 text-center">
                        Allow access to your location
                    </h2>
                    
                    {/* Modal Message */}
                    <p className="text-sm text-gray-600 text-center mb-4">
                        To see nearby <b>News</b> and <b>Reports</b>, we need access to your location.
                        <br />
                        You will see a browser prompt asking for location access. Please click
                        "Allow" to continue.
                    </p>

                    {/* Button */}
                    <button
                        onClick={onAllow} 
                        className="w-full bg-[#D6043C] text-white font-semibold py-2 px-4 rounded focus:outline-none transition-all duration-300"
                        aria-label="Allow Location Access" 
                    >
                        Allow Location Access
                    </button>
                </div>
            </div>
        </div>
    );
}

LocationAccessModal.propTypes = {
    onAllow: PropTypes.func.isRequired,
};

export default LocationAccessModal;
