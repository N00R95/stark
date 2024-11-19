import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../../services/api';
import { FiMapPin, FiHome, FiDroplet, FiMaximize2, FiHeart, FiCalendar, FiFilter, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import PropertyFilters from './PropertyFilters';

export default function AvailableProperties({ language }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        priceRange: 'all',
        bedrooms: 'all',
        location: 'all',
        areaRange: 'all',
        amenities: []
    });

    const navigate = useNavigate();
    const { user } = useAuth();

    const content = {
        en: {
            title: 'Available Properties',
            noProperties: 'No properties found',
            viewDetails: 'View Details',
            requestTour: 'Request Tour',
            save: 'Save',
            saved: 'Saved',
            error: 'Failed to load properties',
            loading: 'Loading properties...',
            filters: 'Filter Properties',
            hideFilters: 'Hide Filters',
            price: {
                label: 'Price',
                currency: 'SAR'
            },
            features: {
                bedrooms: 'Bedrooms',
                bathrooms: 'Bathrooms',
                area: 'Area'
            },
            amenities: 'Amenities',
        },
        ar: {
            title: 'العقارات المتاحة',
            noProperties: 'لا توجد عقارات',
            viewDetails: 'عرض التفاصيل',
            requestTour: 'طلب جولة',
            save: 'حفظ',
            saved: 'محفوظ',
            error: 'فشل تحميل العقارات',
            loading: 'جاري التحميل...',
            filters: 'تصفية العقارات',
            hideFilters: 'إخفاء التصفية',
            price: {
                label: 'السعر',
                currency: 'ريال'
            },
            features: {
                bedrooms: 'غرف النوم',
                bathrooms: 'دورات المياه',
                area: 'المساحة'
            },
            amenities: 'المرافق',
        }
    };

    const t = content[language];

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await propertyAPI.getAvailable(filters);

            if (response.success && response.data) {
                console.log('API Response:', response); // Debug log
                const propertyData = Array.isArray(response.data) ? response.data : [];
                setProperties(propertyData);
            } else {
                throw new Error(response.message || 'Failed to fetch properties');
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error);
            setError(error.response?.data?.message || error.message || 'Failed to fetch properties');
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    const handleSaveProperty = async (propertyId) => {
        if (!user) {
            navigate('/login/renter');
            return;
        }

        try {
            await propertyAPI.toggleSaveProperty(propertyId);
            setProperties(properties.map(property =>
                property.id === propertyId
                    ? { ...property, is_saved: !property.is_saved }
                    : property
            ));
        } catch (error) {
            console.error('Failed to save property:', error);
        }
    };

    const handleRequestTour = (propertyId) => {
        if (!user) {
            navigate('/login/renter');
            return;
        }
        navigate(`/properties/${propertyId}/tour`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-300"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.title}
                </h1>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                    {showFilters ? <FiX size={16} /> : <FiFilter size={16} />}
                    {showFilters ? t.hideFilters : t.filters}
                </button>
            </div>

            {/* Property Filters - Collapsible on all screens */}
            <div className={`${showFilters ? 'block' : 'hidden'} transition-all duration-300 ease-in-out mb-4`}>
                <PropertyFilters
                    language={language}
                    activeFilters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Properties Grid */}
            {error ? (
                <div className="text-red-500 text-center py-6">{error}</div>
            ) : Array.isArray(properties) && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {properties.map(property => (
                        <div key={property.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img
                                    src={property.images[0] || 'https://placehold.co/600x400'}
                                    alt={property.title}
                                    className="w-full h-40 object-cover rounded-t-lg"
                                />
                                {user && (
                                    <button
                                        onClick={() => handleSaveProperty(property.id)}
                                        className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm ${property.is_saved
                                                ? 'bg-primary text-white'
                                                : 'bg-white text-gray-600'
                                            }`}
                                    >
                                        <FiHeart className={property.is_saved ? 'fill-current' : ''} size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="p-3">
                                <h2 className="text-lg font-semibold mb-2 line-clamp-1">{property.title}</h2>
                                <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-2">
                                    <FiMapPin size={14} />
                                    <span className="line-clamp-1">{property.location}</span>
                                </div>

                                {property.amenities && property.amenities.length > 0 && (
                                    <div className="mb-3">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">{t.amenities}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {property.amenities.slice(0, 3).map((amenity) => (
                                                <span
                                                    key={amenity.id}
                                                    className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                                >
                                                    {amenity.title}
                                                </span>
                                            ))}
                                            {property.amenities.length > 3 && (
                                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                    +{property.amenities.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {property.bedrooms && (
                                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                                            <FiHome size={14} />
                                            <span>{property.bedrooms}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                        <FiDroplet size={14} />
                                        <span>{property.bathrooms}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                        <FiMaximize2 size={14} />
                                        <span>{property.area}m²</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-bold">
                                        {property.price} SAR
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRequestTour(property.id)}
                                            className="px-2 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors"
                                        >
                                            <FiCalendar className="inline-block mr-1" size={14} />
                                            {t.requestTour}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/properties/${property.id}`)}
                                            className="px-2 py-1 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                                        >
                                            {t.viewDetails}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500 text-center py-6">{t.noProperties}</div>
            )}
        </div>
    );
}
