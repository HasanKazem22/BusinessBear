import { getCookie, setCookie, deleteCookie } from './utils/cookies';

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
  _retry?: boolean;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<any> {
  const { requireAuth = true, headers, _retry = false, ...customConfig } = options;

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
    const token = getCookie('auth_token') || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Auto-refresh token on 401 Unauthorized
    if (response.status === 401 && requireAuth && !_retry && !endpoint.includes('/auth/')) {
      const currentToken = getCookie('auth_token') || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
      if (currentToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: currentToken }),
          });

          if (refreshRes.ok) {
            const authData = await refreshRes.json();
            const newToken = authData.accessToken || authData.token;
            setCookie('auth_token', newToken);

            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', newToken);
              if (authData.rolePermission) {
                localStorage.setItem('role_permission', JSON.stringify(authData.rolePermission));
              }
              if (authData.user) {
                localStorage.setItem('user_info', JSON.stringify(authData.user));
              }
            }

            // Retry original request once with new token
            return apiFetch(endpoint, { ...options, _retry: true });
          }
        } catch (refreshErr) {
          deleteCookie('auth_token');
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/login';
          }
        }
      }
    }

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
