import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AuthService from "../services/authService";

const BASE_URL_USER = import.meta.env.VITE_BASE_URL_USER;

// Fetch all news
export const fetchNews = createAsyncThunk(
  "news/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await AuthService.newsData(50, 1, token);
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch news");
    }
  }
);


export const fetchNewsByDate = createAsyncThunk(
  "news/fetchByDate",
  async (date, { rejectWithValue }) => {

    try {
      const response = await axios.get(
        `${BASE_URL_USER}/news/date/${date}?page=${1}&limit=${50}`
      );

      

      return response.data.news; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch news by date"
      );
    }
  }
);


const newsSlice = createSlice({
  name: "news",
  initialState: {
    data: {
      all: [], 
      byDate: [] 
    },
    loading: false,
    error: null,
    selectedDate: null 
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload; 
    },
    clearNewsByDate: (state) => {
      state.data.byDate = []; 
      state.selectedDate = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, all: action.payload }; 
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(fetchNewsByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          ...state.data,
          byDate: action.payload
        }; 
      })
      .addCase(fetchNewsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch news by date";
      });
  }
});

export const { clearNewsByDate, setSelectedDate } = newsSlice.actions;
export default newsSlice.reducer;
