import axios from 'axios';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://202.58.199.194:8080/api-appit/public/wig';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          throw new Error('Unauthorized. Please login again.');
        case 403:
          throw new Error('Access forbidden.');
        case 404:
          throw new Error('Resource not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data?.message || `Error ${status}: ${error.message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  GROWTH: '/growth',
  REVENUE_GROWTH: '/getRevenueGrowth',
  DIVISION_PROGRESS: '/getDivisionProgress',
  LEAD_MEASURE_INPUT: '/getLeadMeasureInput',
  WIG_STATUS: '/getWigStatus',
  LEAD_MEASURE_G: '/getLeadMeasureG',
  GET_WIG: (id) => `/getwig/${id}`,
  GET_LEAD_MEASURE: '/getLeadMeasure',
  UPDATE_LEAD_MEASURE: '/updateLeadMeasure',
  DELETE_LEAD_MEASURE: '/hapusLeadMeasure',
  ADD_LEAD_MEASURE: '/tambahLeadMeasure',
};

// API functions
export const apiService = {
  // Authentication
  login: (credentials) => apiClient.post(API_ENDPOINTS.LOGIN, credentials),
  
  // Dashboard data
  getGrowth: () => apiClient.get(API_ENDPOINTS.GROWTH),
  getRevenueGrowth: () => apiClient.get(API_ENDPOINTS.REVENUE_GROWTH),
  getDivisionProgress: () => apiClient.get(API_ENDPOINTS.DIVISION_PROGRESS),
  getLeadMeasureInput: () => apiClient.get(API_ENDPOINTS.LEAD_MEASURE_INPUT),
  getWigStatus: () => apiClient.get(API_ENDPOINTS.WIG_STATUS),
  getLeadMeasureG: () => apiClient.get(API_ENDPOINTS.LEAD_MEASURE_G),
  
  // Lead measure operations
  getWig: (id) => apiClient.get(API_ENDPOINTS.GET_WIG(id)),
  getLeadMeasure: (data) => apiClient.post(API_ENDPOINTS.GET_LEAD_MEASURE, data),
  updateLeadMeasure: (data) => apiClient.post(API_ENDPOINTS.UPDATE_LEAD_MEASURE, data),
  deleteLeadMeasure: (data) => apiClient.post(API_ENDPOINTS.DELETE_LEAD_MEASURE, data),
  addLeadMeasure: (data) => apiClient.post(API_ENDPOINTS.ADD_LEAD_MEASURE, data),
};

export default apiClient;