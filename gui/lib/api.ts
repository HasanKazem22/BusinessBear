import { getCookie } from './utils/cookies';

export const BACKEND_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`;

/** Converts a relative /uploads/... path to a full server URL */
export function resolveMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `${BACKEND_BASE_URL}${url}`;
  return url;
}

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
    },
  };

  if (!(customConfig.body instanceof FormData)) {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  if (requireAuth) {
    const token = getCookie('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // We parse text first in case response is not JSON
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      };
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}
