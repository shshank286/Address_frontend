import React, { useEffect, useRef } from "react";
import apple from "../assets/images/apple.png";
import gmail from "../assets/images/gmail.png";
import facebook from "../assets/images/facebook.png";
import { registerGoogle } from "../services/authService"; 
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, closePopup, token } from "../Context/authSlice";
import { getProfile } from "../services/authService";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

function SocialMediaLogin({ hidePopup }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const googleClientId = "315043487911-u9rot2i250gidbsl71oh0ihld85lql47.apps.googleusercontent.com"

  useEffect(() => {


    // Initialize Google Login
    window.google.accounts.id.initialize({
      client_id: { googleClientId },
      callback: handleGoogleLoginSuccess,

    });

    if (!document.getElementById("facebook-jssdk")) {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
      fbScript.onload = () => {
        window.FB.init({
          appId: "2238604293161761", 
          cookie: true,
          xfbml: true,
          version: "v12.0",
        });
      };
      document.body.appendChild(fbScript);
    }
  }, []);

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const idToken = response.credential;
      const decoded = JSON.parse(atob(idToken.split(".")[1]));

      const email = decoded.email;
      const fname = decoded.given_name;
      const lname = decoded.family_name;
      const profile = decoded.picture;

      console.log("Google Login Success:", decoded);

      const result = await registerGoogle(idToken, "google", email, fname, lname, profile);

     
      const token = result.token
      const userId = result.userId
      const name = fname;
      let profilePicture = result?.profilePicture;

      localStorage.setItem("token", token);

      const profileResponse = await getProfile();
      console.log("profile", profileResponse);

      profilePicture = profileResponse.profile.profile_picture;
      dispatch(login({ token, email, userId, name, profilePicture }));
      dispatch(closePopup()); 

      navigate("/");

    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };



  // Handle Facebook Login Success
  const handleFacebookLogin = () => {
    window.FB.login(
      (response) => {
        if (response.status === "connected") {
          const { accessToken } = response.authResponse;

          window.FB.api(
            "/me",
            { fields: "first_name,last_name,email,picture" },
            async (userDetails) => {
              const result = await registerGoogle(
                accessToken,
                "facebook",
                userDetails.email,
                userDetails.first_name,
                userDetails.last_name,
                userDetails.picture?.data?.url
              );
              console.log("Facebook Login Success:", result);

              // Hide the popup and navigate to home page
              hidePopup();
              navigate("/");
            }
          );
        } else {
          console.error("Facebook Login Failed:", response);
        }
      },
      { scope: "email" }
    );
  };



  // Redirect to Facebook Login
  const redirectToFacebookLogin = () => {
    const appId = "2238604293161761";
    const redirectUri = "http://localhost:8000/api/auth/facebook";
    const scope = "email";
    window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const handleGoogleLoginFailure = (response) => {
    console.log('Login Failed:', response);
  };

  const googleLoginRef = useRef(null);

  const handleCustomGoogleClick = () => {
    if (googleLoginRef.current) {
      googleLoginRef.current.click(); 
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-5">
      <div className="flex gap-3 justify-center sm:gap-5">
        <img
          className="hover:scale-105 h-7 cursor-pointer"
          onClick={redirectToFacebookLogin}
          src={facebook}
          alt="Facebook"
        />

        <img role="button"
          onClick={() => document.getElementById('google-login-btn').click()}
          className="hover:scale-105 h-7 cursor-pointer hidden" src={gmail} alt="Apple" />

        <div className=" justify-center  ">

          <GoogleLogin
            theme="outline"
            shape="square"
            size="medium"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            useOneTap
            ref={googleLoginRef} 
            style={{ display: "none" }}
            onError={() => {
              console.log('LOGINFAILED"::');

            }}
          />
        </div>

        <img role="button" className="hover:scale-105 h-7 cursor-pointer" src={apple} alt="Apple" />
      </div>
    </div>
  );
}

export default SocialMediaLogin;

const CustomBtn = () => {

  const glogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log('Login success:', response);
      const email = await getEmailFromToken(response.access_token);
      console.log('User Email:', email);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });


  const getEmailFromToken = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const token = accessToken;
        const userInfo = await response.json();
        const email = userInfo.email;
        const fname = userInfo.given_name;
        const lname = userInfo.family_name;
        const profile = userInfo.picture;
        const userId = userInfo.sub;

        console.log("EMAIL ->", email, "Name ->", fname);
        const result = await registerGoogle(accessToken, "google", email, fname, lname, profile);
        console.log('Google Login Success ...');
        dispatch(login({ token, email, userId }));
        console.log('Google Login Success ...', result);

      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };


  return (
    <div className="">
      <button type="submit" onClick={() => { glogin() }}>
        <img className="hover:scale-105 h-7 cursor-pointer" src={gmail} alt="Gmail" />
      </button>
    </div>
  )
}
