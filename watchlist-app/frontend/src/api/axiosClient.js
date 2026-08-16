import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export function getStoredTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

export function setAuthTokens({ access, refresh }) {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearAuthTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

const axiosClient = axios.create({ baseURL: BASE_URL });

// Attach the access token to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const { access } = getStoredTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// On a 401, use the refresh token to get a new access token once,
// then seamlessly retry the original request. If refreshing itself
// fails, clear tokens and send the user to /login.
let refreshRequest = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Don't try to refresh on the refresh/login endpoints themselves.
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/token");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const { refresh } = getStoredTokens();

      if (!refresh) {
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Share a single in-flight refresh across concurrent 401s.
        if (!refreshRequest) {
          refreshRequest = axios
            .post(`${BASE_URL}/auth/token/refresh/`, { refresh })
            .finally(() => {
              refreshRequest = null;
            });
        }
        const { data } = await refreshRequest;
        setAuthTokens({ access: data.access, refresh });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access}`,
        };
        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
