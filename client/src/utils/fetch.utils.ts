import { getAuthHeaders } from './auth.utils';

export const fetchApi = async ({
  url,
  method = 'GET',
  data,
  token,
  refreshToken
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  token?: string;
  refreshToken?: string;
}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(), // Automatically include auth headers
  };

  if (token) {
    headers['Authorization'] = `${token}`;
  }
  if (refreshToken) {
    headers['x-refresh-token'] = `${refreshToken}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();
  // If token expired, try refreshing
  if (response.status === 401) {
    const newToken = await tryRefreshToken();

    if (newToken) {
      // Retry original request with new token
      const retryResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      return retryResponse.json();
    } else {
      throw new Error('Unauthorized, and refresh failed');
    }
  }

  if (!response.ok) {
    throw new Error(result?.message || 'API Error');
  }

  return result;
};

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const { accessToken, refreshToken: newRefreshToken } = data.data;

    const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
    storage.setItem('accessToken', accessToken);
    if (newRefreshToken) storage.setItem('refreshToken', newRefreshToken); // Optional rotation

    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}
