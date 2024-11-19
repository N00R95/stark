import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const checkAuth = async (type = null) => {
        try {
            const storedType = localStorage.getItem('userType') || type;

            const response = await authAPI.checkAuth(storedType)
            if (response.success) {
                setUser(response.user)
                if (response.user?.profile?.type) {
                    localStorage.setItem('userType', response.user.profile.type)
                }
            } else {
                setUser(null)
                localStorage.removeItem('token')
                localStorage.removeItem('userType')
            }
        } catch (err) {
            console.error('Auth check failed:', err)
            setUser(null)
            localStorage.removeItem('token')
            localStorage.removeItem('userType')
            if (err.response?.status === 401 && !location.pathname.includes('/login')) {
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const memoizedCheckAuth = useCallback(checkAuth, [navigate, location])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            memoizedCheckAuth()
        } else {
            setLoading(false)
        }
    }, [memoizedCheckAuth])

    const login = async (phone) => {
        try {
            setError(null);
            const response = await authAPI.sendOTP({
                phone,
                channel: 'sms'
            });
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const verifyOTP = async (phone, otp, type) => {
        try {
            setError(null);
            const response = await authAPI.verifyOTP({
                phone,
                otp,
                type
            });

            if (response.success && response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', type);
                setUser(response.user);
            }

            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout()
            setUser(null)
            localStorage.removeItem('token')
            localStorage.removeItem('userType')
            navigate('/login')
        } catch (err) {
            console.error('Logout failed:', err)
            setUser(null)
            localStorage.removeItem('token')
            localStorage.removeItem('userType')
            navigate('/login')
        }
    }

    const value = {
        user,
        loading,
        error,
        setError,
        login,
        verifyOTP,
        logout,
        checkAuth
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
