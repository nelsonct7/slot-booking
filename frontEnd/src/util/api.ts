import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const createApiClient = (
  baseURL: string,
  config: Partial<ApiClientConfig> = {}
): AxiosInstance => {
  const defaultConfig: ApiClientConfig = {
    baseURL,
    timeout: 5000, // 5 seconds is more reasonable
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  };

  const client: AxiosInstance = axios.create(defaultConfig);

  // Add retry logic with proper typing
  const retryConfig: IAxiosRetryConfig = {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error: AxiosError): boolean => {
      const shouldRetry = axiosRetry.isNetworkOrIdempotentRequestError(error);
      const isConnectionTimeout = error.code === "ECONNABORTED";
      return shouldRetry || isConnectionTimeout;
    },
    // Optional: Implement onRetry callback for logging
    onRetry: (
      retryCount: number,
      error: AxiosError,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestConfig: any
    ): void => {
      console.warn(
        ` API Retry attempt ${retryCount}:`,
        error.message,
        `(${requestConfig.url})`
      );
    },
  };

  axiosRetry(client, retryConfig);

  // Add response interceptor with proper typing
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        console.error(` API Error:`, {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          url: error.config?.url,
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("swarm-user-token");
        }
      } else {
        console.error(`Unexpected Error:`, error);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const localHost=window.location.href.includes('localhost')
console.log("[!] IsLocal ",localHost);
// Get the API URLs from Vite environment variables
// Use relative URLs or environment variables

const API_URL = localHost 
  ? 'http://localhost:3002/api'
  : '/appointment-api/api'; // This will be handled by Nginx

export const appointmentServiceClient: AxiosInstance = createApiClient(
  API_URL
);

// Optional: Add custom error handling types
export type ApiErrorResponse = {
  status: number;
  message: string;
  details?: unknown;
};

// Optional: Add custom response type
export type ApiSuccessResponse<T> = {
  data: T;
  status: number;
  message?: string;
};
