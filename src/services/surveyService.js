import { apiClientUser } from "../utils/apiHelper";

export const getSurveyById = async (id) => {
  try {
    const response = await apiClientUser.get(`/survey/${id}/results`);

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey:", error);
    throw error;
  }
};

export const postSurveyById = async (surveyId, selectedOption) => {
  try {
    const response = await apiClientUser.post(`/survey/submit`, {
      surveyId,
      selectedOption
    });

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey:", error);
    throw error;
  }
};

export const getSurveyBarChartAge = async (id) => {
  try {
    const response = await apiClientUser.get(`/survey/barchart-age/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey bar chart age:", error);
    throw error;
  }
};
export const getSurveyPieChartAge = async (id) => {
  try {
    const response = await apiClientUser.get(`/survey/piechart-age/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey bar chart age:", error);
    throw error;
  }
};



export const getSurveyPieChartGender = async (id) => {
  try {
    const response = await apiClientUser.get(`/survey/piechart-gender/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey bar chart age:", error);
    throw error;
  }
};

export const getSurveyBarChartGender = async (id) => {
  try {
    const response = await apiClientUser.get(`/survey/barchart-gender/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey bar chart age:", error);
    throw error;
  }
};

export const getSurveyBarChartOccupation = async (id) => {
  try {
    const response = await apiClientUser.get(
      `/survey/barchart-occupation/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error while fetching survey bar chart age:", error);
    throw error;
  }
};
