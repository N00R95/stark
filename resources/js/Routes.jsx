import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AvailableProperties from './components/properties/AvailableProperties';
import PropertyDetails from './components/properties/PropertyDetails';
import MapView from './components/categories/MapView';
import CustomerService from './components/categories/CustomerService';
import Home from './components/Home';

// Owner Components
import OwnerLayout from './components/owner/OwnerLayout';
import OwnerProfile from './components/owner/Profile';
import MyProperties from './components/owner/MyProperties';
import PropertyForm from './components/owner/PropertyForm';
import TourRequests from './components/owner/TourRequests';

// Renter Components
import RenterLayout from './components/renter/RenterLayout';
import RenterProfile from './components/renter/Profile';
import Tours from './components/renter/Tours';
import SavedProperties from './components/renter/SavedProperties';
import MyBookings from './components/renter/MyBookings';

export default function AppRoutes({ language }) {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home language={language} />} />
            <Route path="/properties/available" element={<AvailableProperties language={language} />} />
            <Route path="/properties/:id" element={<PropertyDetails language={language} />} />
            <Route path="/map" element={<MapView language={language} />} />
            <Route path="/customer-service" element={<CustomerService language={language} />} />

            {/* Auth Routes */}
            <Route path="/login/renter" element={<Login language={language} userType="renter" />} />
            <Route path="/login/owner" element={<Login language={language} userType="owner" />} />
            <Route path="/register/renter" element={<Register language={language} userType="renter" />} />
            <Route path="/register/owner" element={<Register language={language} userType="owner" />} />

            {/* Owner Routes */}
            <Route path="/owner" element={
                <ProtectedRoute userType="owner">
                    <OwnerLayout language={language} />
                </ProtectedRoute>
            }>
                <Route path="properties" element={<MyProperties language={language} />} />
                <Route path="properties/add" element={<PropertyForm language={language} />} />
                <Route path="profile" element={<OwnerProfile language={language} />} />
                <Route path="requests" element={<TourRequests language={language} />} />
            </Route>

            {/* Renter Routes */}
            <Route path="/renter" element={
                <ProtectedRoute userType="renter">
                    <RenterLayout language={language} />
                </ProtectedRoute>
            }>
                <Route path="profile" element={<RenterProfile language={language} />} />
                <Route path="tours" element={<Tours language={language} />} />
                <Route path="bookings" element={<MyBookings language={language} />} />
                <Route path="saved" element={<SavedProperties language={language} />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
} 