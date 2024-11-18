export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        SEND_OTP: '/auth/send-otp',
        VERIFY_OTP: '/auth/verify-otp',
        REGISTER_VERIFY_OTP: '/auth/register/verify-otp',
        LOGOUT: '/auth/logout',
        USER: '/auth/user',
    },
    
    // Property endpoints
    PROPERTIES: {
        LIST: '/properties',
        DETAIL: (id) => `/properties/${id}`,
        CREATE: '/properties',
        UPDATE: (id) => `/properties/${id}`,
        DELETE: (id) => `/properties/${id}`,
        SAVE: (id) => `/properties/${id}/save`,
    },
    
    // Tour endpoints
    TOURS: {
        LIST: '/tours',
        CREATE: '/tours',
        UPDATE: (id) => `/tours/${id}`,
        CANCEL: (id) => `/tours/${id}/cancel`,
    },
    
    // Booking endpoints
    BOOKINGS: {
        LIST: '/bookings',
        CREATE: '/bookings',
        CANCEL: (id) => `/bookings/${id}/cancel`,
    },
    
    // Saved properties endpoints
    SAVED: {
        LIST: '/saved-properties',
        TOGGLE: (id) => `/properties/${id}/save`,
    }
}; 