// src/services/commonService.js

import axios from 'axios';
import { BASE_URL } from '@/config';
const commonService = {


  // Function to make a GET request
  get: async (url, params = {}) => {
    console.log("hey"); // Log to indicate the function was called
    try {
      const response = await axios.get(`${BASE_URL}${url}`, { params });
      return response.data; // Return the data from the response
    } catch (error) {
      console.error('Error during GET request:', error); // Error logging
      throw error; // Rethrow the error for further handling
    }
  },

  // Function to make a POST request
  post: async (url, data) => {
    try {
      const response = await axios.post(`${BASE_URL}${url}`, data);
      return response.data;
    } catch (error) {
      console.error('Error during POST request:', error);
      throw error;
    }
  },

  // Function to make a PUT request
  put: async (url, data) => {
    try {
      const response = await axios.put(`${BASE_URL}${url}`, data);
      return response.data;
    } catch (error) {
      console.error('Error during PUT request:', error);
      throw error;
    }
  },

  // Function to make a DELETE request
  delete: async (url) => {
    try {
      const response = await axios.delete(`${BASE_URL}${url}`);
      return response.data;
    } catch (error) {
      console.error('Error during DELETE request:', error);
      throw error;
    }
  },
};

export default commonService;