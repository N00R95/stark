import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HiHome, HiUserGroup, HiUserCircle } from 'react-icons/hi';
import { BiCategory } from 'react-icons/bi';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-nav.jpg';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

function Navbar({ language, setLanguage }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [showLoginOptions, setShowLoginOptions] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Get current user type from URL or localStorage
    const getCurrentUserType = () => {
        if (location.pathname.includes('/owner/')) return 'owner';
        if (location.pathname.includes('/renter/')) return 'renter';
        return localStorage.getItem('currentUserType') || 'renter';
    };

    const [currentUserType, setCurrentUserType] = useState(getCurrentUserType());

    useEffect(() => {
        setCurrentUserType(getCurrentUserType());
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            setIsProfileMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSwitchProfile = (type) => {
        localStorage.setItem('currentUserType', type);
        setCurrentUserType(type);
        setIsProfileMenuOpen(false);
        navigate(type === 'owner' ? '/owner/properties' : '/properties/available');
    };

    const navItems = {
        en: [
            { path: '/', text: 'Home', icon: <HiHome className="w-5 h-5" /> },
            { path: '/properties/available', text: 'Properties', icon: <BiCategory className="w-5 h-5" /> },
            { path: '/map', text: 'Map View', icon: <FaMapMarkedAlt className="w-5 h-5" /> },
            { path: '/customer-service', text: 'Customer Service', icon: <HiUserGroup className="w-5 h-5" /> }
        ],
        ar: [
            { path: '/', text: 'الرئيسية', icon: <HiHome className="w-5 h-5" /> },
            { path: '/properties/available', text: 'العقارات', icon: <BiCategory className="w-5 h-5" /> },
            { path: '/map', text: 'عرض الخريطة', icon: <FaMapMarkedAlt className="w-5 h-5" /> },
            { path: '/customer-service', text: 'خدمة العملاء', icon: <HiUserGroup className="w-5 h-5" /> }
        ]
    };

    const userMenuItems = {
        en: {
            owner: [
                { path: '/owner/properties', text: 'My Properties' },
                { path: '/owner/properties/add', text: 'Add Property' },
                { path: '/owner/requests', text: 'Tour Requests' },
                { path: '/owner/profile', text: 'Profile' }
            ],
            renter: [
                { path: '/renter/tours', text: 'My Tours' },
                { path: '/renter/bookings', text: 'My Bookings' },
                { path: '/renter/saved', text: 'Saved Properties' },
                { path: '/renter/profile', text: 'Profile' }
            ]
        },
        ar: {
            owner: [
                { path: '/owner/properties', text: 'عقاراتي' },
                { path: '/owner/properties/add', text: 'إضافة عقار' },
                { path: '/owner/requests', text: 'طلبات الجولات' },
                { path: '/owner/profile', text: 'الملف الشخصي' }
            ],
            renter: [
                { path: '/renter/tours', text: 'جولاتي' },
                { path: '/renter/bookings', text: 'حجوزاتي' },
                { path: '/renter/saved', text: 'العقارات المحفوظة' },
                { path: '/renter/profile', text: 'الملف الشخصي' }
            ]
        }
    };

    const renderUserMenu = () => {
        if (!user?.profile) return null;

        const hasMultipleProfiles = user.profiles?.length > 1;
        const currentProfile = user.profiles?.find(p => p.type === currentUserType) || user.profile;
        const menuItems = userMenuItems[language][currentUserType];

        return (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {/* Profile Info */}
                <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{currentProfile.full_name}</p>
                    <p className="text-xs text-gray-500">{currentProfile.email}</p>
                </div>

                {/* Menu Items */}
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        {item.text}
                    </Link>
                ))}

                {/* Switch Profile Option */}
                {hasMultipleProfiles && (
                    <div className="border-t">
                        <button
                            onClick={() => handleSwitchProfile(currentUserType === 'owner' ? 'renter' : 'owner')}
                            className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 text-left"
                        >
                            {language === 'ar' ? 'تبديل إلى ' : 'Switch to '}
                            {currentUserType === 'owner' ?
                                (language === 'ar' ? 'حساب المستأجر' : 'Renter Account') :
                                (language === 'ar' ? 'حساب المالك' : 'Owner Account')}
                        </button>
                    </div>
                )}

                {/* Logout */}
                <div className="border-t">
                    <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                        {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                </div>
            </div>
        );
    };

    const renderMenuItems = (items = []) => {
        return items?.map((item) => (
            <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    location.pathname === item.path
                        ? 'text-primary font-semibold'
                        : 'text-gray-700 hover:text-primary'
                }`}
            >
                {item.icon}
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                    {item.text}
                </span>
            </Link>
        )) || null;
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Language Toggle - Left */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 ${language === 'en'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage('ar')}
                            className={`px-3 py-1 ${language === 'ar'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                        >
                            AR
                        </button>
                    </div>

                    {/* Navigation Menu - Center */}
                    <div className="hidden md:flex items-center justify-center flex-1 mx-4">
                        {renderMenuItems(navItems[language])}
                    </div>

                    {/* Logo and User - Right */}
                    <div className="flex items-center gap-4">
                        {user?.profile ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <HiUserCircle className="w-8 h-8 text-gray-600" />
                                    <span className={`text-sm truncate max-w-[100px] ${language === 'ar' ? 'font-arabic' : ''}`}>
                                        {user.profile.full_name} ({user.profile.type})
                                    </span>
                                </button>
                                {isProfileMenuOpen && (
                                    renderUserMenu()
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoginOptions(!showLoginOptions)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover"
                                >
                                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                </button>

                                {/* Login Options Dropdown */}
                                {showLoginOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            to="/login/renter"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowLoginOptions(false)}
                                        >
                                            {language === 'ar' ? 'دخول كمستأجر' : 'Login as Renter'}
                                        </Link>
                                        <Link
                                            to="/login/owner"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowLoginOptions(false)}
                                        >
                                            {language === 'ar' ? 'دخول كمالك' : 'Login as Owner'}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                        <Link to="/">
                            <img src={logo} alt="Logo" className="h-14 md:h-16 w-auto" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-50">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems[language].map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                                        {item.text}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
Navbar.propTypes = {
    language: PropTypes.string.isRequired,
    setLanguage: PropTypes.func.isRequired,
};

export default Navbar;

