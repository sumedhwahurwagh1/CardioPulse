import axios, { AxiosError } from 'axios';
import type { PatientData, PredictionResponse, ModelInfoResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // 8 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  status?: number;
  code?: string;
  detail?: string;

  constructor(message: string, status?: number, code?: string, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: any }>;
    if (axiosError.code === 'ECONNABORTED') {
      throw new ApiError('The request timed out. Please check if the backend server is running and try again.', 408, 'TIMEOUT');
    }
    if (!axiosError.response) {
      throw new ApiError('Network error: Unable to connect to the backend server. Please verify it is running on port 8000.', 503, 'NETWORK_ERROR');
    }
    
    const status = axiosError.response.status;
    const rawDetail = axiosError.response.data?.detail;
    let detailMessage = 'An unexpected error occurred.';
    
    if (typeof rawDetail === 'string') {
      detailMessage = rawDetail;
    } else if (Array.isArray(rawDetail)) {
      // Pydantic validation error format
      detailMessage = rawDetail.map(err => `${err.loc?.join('.')} : ${err.msg}`).join('; ');
    } else if (rawDetail && typeof rawDetail === 'object') {
      detailMessage = JSON.stringify(rawDetail);
    }
    
    throw new ApiError(detailMessage, status, 'API_ERROR');
  }
  throw new ApiError(error instanceof Error ? error.message : 'An unknown error occurred.');
};

export const apiService = {
  /**
   * Check connection status of backend
   */
  async checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
    try {
      const response = await client.get('/health');
      return {
        status: response.data?.status || 'degraded',
        model_loaded: !!response.data?.details?.model_loaded,
      };
    } catch (error) {
      // Return offline status rather than crashing for UI convenience
      return {
        status: 'offline',
        model_loaded: false,
      };
    }
  },

  /**
   * Get trained model information
   */
  async getModelInfo(): Promise<ModelInfoResponse> {
    try {
      const response = await client.get<ModelInfoResponse>('/model-info');
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  /**
   * Submit patient metrics to calculate heart disease risk
   */
  async predict(patientData: PatientData): Promise<PredictionResponse> {
    try {
      const response = await client.post<PredictionResponse>('/predict', patientData);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
