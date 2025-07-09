// API utility for making authenticated requests
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private getAuthHeaders: () => Record<string, string>;
  private onUnauthorized: () => void;

  constructor(
    baseUrl: string, 
    getAuthHeaders: () => Record<string, string>,
    onUnauthorized: () => void
  ) {
    this.baseUrl = baseUrl;
    this.getAuthHeaders = getAuthHeaders;
    this.onUnauthorized = onUnauthorized;
  }

  private async makeRequest<T = unknown>(
    endpoint: string, 
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requireAuth = true, headers = {}, ...fetchOptions } = options;
    
    const requestHeaders = requireAuth 
      ? { ...this.getAuthHeaders(), ...headers }
      : { 'Content-Type': 'application/json', ...headers };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers: requestHeaders,
      });

      const data = await response.json();

      if (response.status === 401) {
        this.onUnauthorized();
        return { success: false, error: 'Authentication required' };
      }

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || data.message || `HTTP ${response.status}` 
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  async get<T = unknown>(endpoint: string, requireAuth = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', requireAuth });
  }

  async post<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    requireAuth = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  async put<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    requireAuth = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  async delete<T = unknown>(endpoint: string, requireAuth = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', requireAuth });
  }
}

// Hook to create an API client instance
export const createApiClient = (
  getAuthHeaders: () => Record<string, string>,
  onUnauthorized: () => void
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
  return new ApiClient(baseUrl, getAuthHeaders, onUnauthorized);
}; 