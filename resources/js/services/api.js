import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from '../config/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        config.headers = {
            ...config.headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };

        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    sendOTP: async (data) => {
        try {
            let phone = data.phone;
            if (!phone.startsWith('+')) {
                phone = phone.startsWith('0')
                    ? '+966' + phone.substring(1)
                    : '+966' + phone;
            }

            const response = await api.post(ENDPOINTS.AUTH.SEND_OTP, {
                phone: phone,
                channel: 'sms'
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyOTP: async (data) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
                phone: data.phone,
                otp: data.otp,
                type: data.type
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    registerVerifyOTP: async (data) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.REGISTER_VERIFY_OTP, {
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                type: data.type,
                business_name: data.business_name,
                business_license: data.business_license,
                otp: data.otp
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', data.type);
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
            localStorage.removeItem('token');
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    },

    checkAuth: async (type = null) => {
        try {
            const userType = type || localStorage.getItem('userType');
            const response = await api.get(
                `${ENDPOINTS.AUTH.USER}${userType ? `?type=${userType}` : ''}`
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
            }
            throw error;
        }
    }
};

export const propertyAPI = {
    getOwnerProperties: async () => {
        try {
            const response = await api.get("/properties/owner", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch owner properties:", error);
            throw error;
        }
    },

    getAvailable: async (filters = {}) => {
        try {
            const response = await api.get("/properties", {
                params: filters,
                timeout: 10000,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch properties:", error);
            if (error.response?.data) {
                throw error.response.data;
            }
            throw error;
        }
    },

    getPropertyDetails: async (id) => {
        try {
            const response = await api.get(`/properties/${id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch property details:", error);
            throw error;
        }
    },

    toggleSaveProperty: async (id) => {
        try {
            const response = await api.post(`/properties/${id}/save`);
            return response.data;
        } catch (error) {
            console.error("Failed to toggle save property:", error);
            throw error;
        }
    },
};

export const tourAPI = {
    // Tour-related endpoints
};

export const bookingAPI = {
    // Booking-related endpoints
};

export const savedAPI = {
    // Saved properties endpoints
};

export default api;
