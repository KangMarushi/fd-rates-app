// src/services/api.js
import axios from 'axios';

const API_URL = 'https://fd-roi-api.onrender.com/'; // Replace with your actual API URL

export const getFdRates = async () => {
    const response = await axios.get(`${API_URL}/api/rates`); // Adjust the endpoint as necessary
    return response.data;
};

export const addFdRate = async (fdRate) => {
    const response = await axios.post(`${API_URL}/api/rates`, fdRate); // Adjust the endpoint as necessary
    return response.data;
};
