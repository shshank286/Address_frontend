import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// Base URL for the API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_USER = import.meta.env.VITE_BASE_URL_USER;

// Create an instance of axios for reuse
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const token = "";

export const apiClientUser = axios.create({
  baseURL: BASE_URL_USER,
  headers: {
    Authorization: `Bearer${token}`
  }
});

apiClientUser.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    let token = localStorage.getItem("token");
    if (!adminToken) {
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);
