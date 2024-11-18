import { useState } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import PropertyFilters from '../properties/PropertyFilters'

export default function MapView({ language }) {
    const [showFilters, setShowFilters] = useState(false)
    const [activeFilters, setActiveFilters] = useState({
        type: 'all',
        priceRange: 'all',
        bedrooms: 'all',
        amenities: [],
        location: 'all'
    })

    const content = {
        en: {
            title: 'Find Properties on Map',
            search: 'Search location...',
            showFilters: 'Show Filters',
            hideFilters: 'Hide Filters',
            loading: 'Loading map...'
        },
        ar: {
            title: 'ابحث عن العقارات على الخريطة',
            search: 'ابحث عن موقع...',
            showFilters: 'إظهار الفلاتر',
            hideFilters: 'إخفاء الفلاتر',
            loading: 'جاري تحميل الخريطة...'
        }
    }

    const t = content[language]

    const handleFilterChange = (newFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            ...newFilters
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className={`text-3xl font-bold ${
                    language === 'ar' ? 'font-arabic' : ''
                }`}>
                    {t.title}
                </h1>
                
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <FiFilter />
                    {showFilters ? t.hideFilters : t.showFilters}
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t.search}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} mb-8`}>
                <PropertyFilters 
                    language={language}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Map placeholder - integrate with your map service */}
            <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
                <p className="text-gray-600">{t.loading}</p>
            </div>
        </div>
    )
} 