import axios from 'axios';
import { CONFIG } from '.';
import { storage } from './storage';

const axiosInstance = axios.create({
    baseURL: CONFIG.BASE_API_URL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = storage.getString("userToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error("Error reading auth token from storage", e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = storage.getString('refreshToken');
                if (refreshToken) {
                    const response = await axiosInstance.post('/refresh-token/', {
                        refresh: refreshToken
                    });
                    if (response.data?.access_token) {
                        const newAccessToken = response.data.access_token;
                        storage.set('userToken', newAccessToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest);
                    } else {
                        console.error("Access token not found in response");
                    }
                } else {
                    console.log("Refresh token doesn't exist");
                }
            } catch (e) {
                console.error("Error during token refresh", e);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;