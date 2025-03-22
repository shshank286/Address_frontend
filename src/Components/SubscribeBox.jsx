import React, { useState } from "react";
import AuthService from "../services/authService";
import {toast} from "react-hot-toast";

const SubscribeBox = () => {

  const [email, setEmail] = useState();

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email address!");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      toast.error("Please enter a valid Gmail address !");
      return;
    }

    setEmail('');
    try {
      const subscriber = await AuthService.subscriptionsApi(email);

      return subscriber.data;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Already Subscribed!");
      } else {
        console.error("An error occurred. Please try again.");
      }
      console.log("SUBSCRIBE", error);
    }
  };


  return (
    <div className="flex justify-center items-center mb-5 pb-14">
      
      <div className="bg-black/50 text-white p-5 rounded-sm shadow-lg w-96">
        {/* Heading */}
        <h2 className="text-center text-2xl font-bold mb-4">Subscribe for updates</h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Get the latest creative news from newsx about art, design and business
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Your email address.."
            className="w-full px-4 py-2 text-white text-sm rounded focus:outline-none bg-black"
          />
        </div>

        {/* Subscribe Button */}
        <button onClick={handleSubscribe} className="w-full bg-[#D6043C] text-white py-2 rounded font-medium ">
          SUBSCRIBE
        </button>

        {/* Privacy Policy */}
        <div className="mt-4 text-center text-gray-400 text-xs">
          <label className="flex items-center justify-center space-x-2">
            <input type="checkbox" className="form-checkbox text-red-500" checked />
            <span>
              By signing up, you agree to the terms and our Privacy Policy agreement
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SubscribeBox;
