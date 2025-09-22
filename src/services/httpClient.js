import { API_CONFIG } from '../constants/api';

export const createApiError = (message, status, code) => {
  const error = new Error(message);
  error.name = 'ApiError';
  error.status = status;
  error.code = code;
  return error;
};

export const createHttpClient = (baseURL = API_CONFIG.BASE_URL) => {
  const buildUrl = (url, params = {}) => {
    const fullUrl = new URL(url.startsWith('http') ? url : `${baseURL}${url}`);

    // Add query parameters
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          fullUrl.searchParams.append(key, params[key]);
        }
      });
    }

    return fullUrl.toString();
  };

  const makeRequest = async (url, options = {}) => {
    const { params, ...fetchOptions } = options;

    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Add API key if available
    if (API_CONFIG.API_KEY) {
      headers['x-cg-demo-api-key'] = API_CONFIG.API_KEY;
    }

    const fullUrl = buildUrl(url, params);

    console.log(`API Request: ${fetchOptions.method || 'GET'} ${fullUrl}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`API Response: ${response.status} ${fullUrl}`);

      if (!response.ok) {
        let errorMessage = response.statusText || 'Unknown error';

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Unable to parse error response
        }

        switch (response.status) {
          case 429:
            throw createApiError('Rate limit exceeded. Please try again later.', response.status, 'RATE_LIMIT');
          case 404:
            throw createApiError('Requested resource not found.', response.status, 'NOT_FOUND');
          case 500:
            throw createApiError('Internal server error. Please try again later.', response.status, 'SERVER_ERROR');
          default:
            throw createApiError(errorMessage, response.status, 'API_ERROR');
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Request Error:', error);

      if (error.name === 'AbortError') {
        throw createApiError('Request timeout. Please try again.', undefined, 'TIMEOUT_ERROR');
      }

      if (error.name === 'ApiError') {
        throw error;
      }

      // Network or other fetch errors
      throw createApiError('Network error. Please check your connection.', undefined, 'NETWORK_ERROR');
    }
  };

  return {
    get: async (url, config = {}) => {
      return makeRequest(url, { ...config, method: 'GET' });
    },
    post: async (url, data, config = {}) => {
      return makeRequest(url, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    put: async (url, data, config = {}) => {
      return makeRequest(url, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    delete: async (url, config = {}) => {
      return makeRequest(url, { ...config, method: 'DELETE' });
    }
  };
};