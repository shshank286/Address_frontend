import { apiClientUser } from "../utils/apiHelper";

export const getCountries = async () => {
  try {
    const response = await apiClientUser.get("/address/countries");
    console.log("Fetched Countries:", response.data);
    return response.data || []; // Ensure it returns an array
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export const getStatesByCountry = async (countryId) => {
  try {
    const response = await apiClientUser.get(`/address/states/${countryId}`);
    console.log("Fetched States:", response.data);
    return Array.isArray(response.data) ? response.data : []; // Ensure it returns an array
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

export const getCitiesByState = async (stateId) => {
  try {
    const response = await apiClientUser.get(`/address/cities/${stateId}`);
    console.log("Fetched Cities:", response.data);
    return Array.isArray(response.data) ? response.data : []; // Ensure it returns an array
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};
