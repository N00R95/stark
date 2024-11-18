import { Outlet, Navigate } from 'react-router-dom'
import RenterSidebar from './RenterSidebar'
import { useAuth } from '../../contexts/AuthContext'

export default function RenterLayout({ language }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    // Redirect if not logged in or not a renter
    if (!user || user?.profile?.type !== 'renter') {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <RenterSidebar language={language} />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
} 