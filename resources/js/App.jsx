import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AvailableProperties from './components/properties/AvailableProperties'
import PropertyDetails from './components/properties/PropertyDetails'
import MapView from './components/categories/MapView'
import CustomerService from './components/categories/CustomerService'
import Home from './components/Home';

// Import Owner Components
import OwnerLayout from './components/owner/OwnerLayout'
import OwnerProfile from './components/owner/Profile'
import MyProperties from './components/owner/MyProperties'
import PropertyForm from './components/owner/PropertyForm'
import TourRequests from './components/owner/TourRequests'
import OwnerSettings from './components/owner/Settings'

// Import Renter Components
import RenterLayout from './components/renter/RenterLayout'
import RenterProfile from './components/renter/Profile'
import Tours from './components/renter/Tours'
import SavedProperties from './components/renter/SavedProperties'
import MyBookings from './components/renter/MyBookings'



function App() {
    const [language, setLanguage] = useState('en');

    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar language={language} setLanguage={setLanguage} />
                    <main className="flex-1">
                        <Routes language={language} />
                    </main>
                    <Footer language={language} />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;










