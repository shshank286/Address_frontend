import toast from "react-hot-toast";
import { apiClientUser } from "../utils/apiHelper";

export const getNewsById = async (id) => {
  try {
    const response = await apiClientUser.get(`/news/${id}`);

    return response.data; 
  } catch (error) {
    alert(error.message)
    console.error("NEWS API error:", error);
    throw error;
  }
};

export const getNewsByCategory = async (name, page = 1, limit = 10, date = null) => {
  try {
    const response = await apiClientUser.get(
      `/news/category/${name}?page=${page}&limit=${limit}&createdAt=${date}`
    );

    return response.data;
  } catch (error) {
    console.error("Get News By Category API error:", error);
    throw error;
  }
};



export const getNewsByBussiness = async (business, page = 1, limit = 50) => {
  try {
    const response = await apiClientUser.get(
      `/news/category/${business}?page=${page}&limit=${limit}`
    );

    console.log("BUSINESS CATEGORY", response.data);

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

export const getNewsByDate = async (createdAt, page = 1, limit = 50) => {
  try {
    const response = await apiClientUser.get(
      `/news/date/${createdAt}?page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

export const getNewsByCountry = async (page = 1, limit = 50) => {
  try {
    const response = await apiClientUser.get(
      `news/country/national`
    );
    console.log("NEWSBYCOUNTRY", response.data);
    return response.data;

  } catch (error) {
    if (error.code === 404) {
      toast.error(error.message);
    } else if (error.code === 400) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred try again later.");
    }
    console.error("Login API error:", error);
    throw error;
  }
};
export const getNewsByInterNational = async (page = 1, limit = 50) => {
  try {
    const response = await apiClientUser.get(
      `news/country/international?page=${page}&limit=${limit}`
    );
    console.log("NEWSBYCOUNTRY", response.data);
    return response.data;

  } catch (error) {
    if (error.code === 404) {
      toast.error(error.message);
    } else if (error.code === 400) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred try again later.");
    }
    console.error("Login API error:", error);
    throw error;
  }
};
