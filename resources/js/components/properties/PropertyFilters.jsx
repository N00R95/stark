import { useState } from 'react'
import { 
    FiCheck, 
    FiHome, 
    FiDollarSign, 
    FiMapPin, 
    FiMaximize2
} from 'react-icons/fi'
import {
    FaSnowflake,
    FaParking,
    FaSwimmingPool,
    FaDumbbell,
    FaShieldAlt,
    FaBuilding,
    FaUmbrella,
    FaTree,
    FaUser,
    FaBox,
    FaCouch,
    FaBlender,
    FaWifi,
    FaSatellite,
    FaPhone,
    FaTools,
    FaMosque,
    FaShoppingCart,
    FaGraduationCap,
    FaPaw
} from 'react-icons/fa'

export default function PropertyFilters({ language, activeFilters, onFilterChange }) {
    const [showCustomRange, setShowCustomRange] = useState(false)
    const [customPrice, setCustomPrice] = useState({
        min: '',
        max: ''
    })

    // Map amenities to icons - using same icons as PropertyDetails
    const amenityIcons = {
        central_ac: FaSnowflake,
        parking: FaParking,
        swimming_pool: FaSwimmingPool,
        gym: FaDumbbell,
        security: FaShieldAlt,
        elevator: FaBuilding,
        balcony: FaUmbrella,
        garden: FaTree,
        maid_room: FaUser,
        storage: FaBox,
        furnished: FaCouch,
        kitchen_appliances: FaBlender,
        internet: FaWifi,
        satellite: FaSatellite,
        intercom: FaPhone,
        maintenance: FaTools,
        mosque: FaMosque,
        shopping: FaShoppingCart,
        schools: FaGraduationCap,
        pets_allowed: FaPaw
    };

    const content = {
        en: {
            propertyType: 'Property Type',
            priceRange: 'Price Range',
            bedrooms: 'Bedrooms',
            amenities: 'Amenities',
            location: 'Location',
            area: 'Area (m²)',
            types: {
                all: 'All Types',
                apartment: 'Apartment',
                villa: 'Villa',
                office: 'Office',
                shop: 'Shop',
                land: 'Land'
            },
            priceRanges: {
                all: 'Any Price',
                '0-5000': 'Up to 5,000 SAR',
                '5000-10000': '5,000 - 10,000 SAR',
                '10000-15000': '10,000 - 15,000 SAR',
                '15000-20000': '15,000 - 20,000 SAR',
                '20000-30000': '20,000 - 30,000 SAR',
                '30000-50000': '30,000 - 50,000 SAR',
                '50000-100000': '50,000 - 100,000 SAR',
                '100000': 'Above 100,000 SAR'
            },
            bedroomOptions: {
                all: 'Any',
                '0': 'Studio',
                '1': '1 Bedroom',
                '2': '2 Bedrooms',
                '3': '3 Bedrooms',
                '4': '4+ Bedrooms'
            },
            locations: {
                all: 'All Locations',
                riyadh: 'Riyadh',
                jeddah: 'Jeddah',
                dammam: 'Dammam',
                khobar: 'Khobar'
            },
            amenityCategories: {
                'Basic Features': [
                    'central_ac',
                    'parking',
                    'elevator',
                    'security'
                ],
                'Comfort & Convenience': [
                    'furnished',
                    'kitchen_appliances',
                    'balcony',
                    'storage'
                ],
                'Leisure & Recreation': [
                    'swimming_pool',
                    'gym',
                    'garden',
                    'playground'
                ],
                'Services & Utilities': [
                    'internet',
                    'satellite',
                    'intercom',
                    'maintenance'
                ],
                'Nearby Facilities': [
                    'mosque',
                    'shopping',
                    'schools'
                ],
                'Additional Features': [
                    'maid_room',
                    'driver_rooms',
                    'private_roof',
                    'pets_allowed'
                ]
            },
            amenityLabels: {
                central_ac: 'Central AC',
                parking: 'Parking',
                swimming_pool: 'Swimming Pool',
                gym: 'Gym',
                security: '24/7 Security',
                elevator: 'Elevator',
                balcony: 'Balcony',
                garden: 'Garden',
                maid_room: "Maid's Room",
                storage: 'Storage Room',
                furnished: 'Furnished',
                kitchen_appliances: 'Kitchen Appliances',
                internet: 'Internet',
                satellite: 'Satellite/Cable TV',
                intercom: 'Intercom',
                maintenance: 'Maintenance',
                mosque: 'Nearby Mosque',
                shopping: 'Shopping Centers',
                schools: 'Schools Nearby',
                pets_allowed: 'Pets Allowed',
                driver_rooms: "Driver's Room",
                private_roof: 'Private Roof',
                playground: 'Playground'
            },
            customRange: 'Custom Range',
            minPrice: 'Min Price',
            maxPrice: 'Max Price',
            apply: 'Apply',
            back: 'Back',
            reset: 'Reset Filters',
            areaRanges: {
                all: 'Any Size',
                '0-100': 'Up to 100 m²',
                '100-200': '100 - 200 m²',
                '200-300': '200 - 300 m²',
                '300-500': '300 - 500 m²',
                '500-1000': '500 - 1,000 m²',
                '1000': 'Above 1,000 m²'
            }
        },
        ar: {
            propertyType: 'نوع العقار',
            priceRange: 'نطاق السعر',
            bedrooms: 'غرف النوم',
            amenities: 'المميزات',
            location: 'الموقع',
            area: 'المساحة (م²)',
            types: {
                all: 'جميع الأنواع',
                apartment: 'شقة',
                villa: 'فيلا',
                office: 'مكتب',
                shop: 'محل',
                land: 'أرض'
            },
            priceRanges: {
                all: 'أي سعر',
                '0-5000': 'أقل من 5,000 ريال',
                '5000-10000': '5,000 - 10,000 ريال',
                '10000-15000': '10,000 - 15,000 ريال',
                '15000-20000': '15,000 - 20,000 ريال',
                '20000-30000': '20,000 - 30,000 ريال',
                '30000-50000': '30,000 - 50,000 ريال',
                '50000-100000': '50,000 - 100,000 ريال',
                '100000': 'أكثر من 100,000 ريال'
            },
            bedroomOptions: {
                all: 'الكل',
                '0': 'استوديو',
                '1': 'غرفة نوم',
                '2': 'غرفتين نوم',
                '3': '3 غرف نوم',
                '4': '4+ غرف نوم'
            },
            locations: {
                all: 'كل المواقع',
                riyadh: 'الرياض',
                jeddah: 'جدة',
                dammam: 'الدمام',
                khobar: 'الخبر'
            },
            amenityCategories: {
                'Basic Features': [
                    'central_ac',
                    'parking',
                    'elevator',
                    'security'
                ],
                'Comfort & Convenience': [
                    'furnished',
                    'kitchen_appliances',
                    'balcony',
                    'storage'
                ],
                'Leisure & Recreation': [
                    'swimming_pool',
                    'gym',
                    'garden',
                    'playground'
                ],
                'Services & Utilities': [
                    'internet',
                    'satellite',
                    'intercom',
                    'maintenance'
                ],
                'Nearby Facilities': [
                    'mosque',
                    'shopping',
                    'schools'
                ],
                'Additional Features': [
                    'maid_room',
                    'driver_rooms',
                    'private_roof',
                    'pets_allowed'
                ]
            },
            amenityLabels: {
                central_ac: 'تكييف مركزي',
                parking: 'موقف سيارات',
                swimming_pool: 'مسبح',
                gym: 'صالة رياضية',
                security: 'أمن 24/7',
                elevator: 'مصعد',
                balcony: 'شرفة',
                garden: 'حديقة',
                maid_room: 'غرفة خادمة',
                storage: 'غرفة تخزين',
                furnished: 'مفروش',
                kitchen_appliances: 'أجهزة مطبخ',
                internet: 'إنترنت',
                satellite: 'قنوات فضائية',
                intercom: 'اتصال داخلي',
                maintenance: 'صيانة',
                mosque: 'مسجد قريب',
                shopping: 'مراكز تسوق',
                schools: 'مدارس قريبة',
                pets_allowed: 'يسمح بالحيوانات الأليفة',
                driver_rooms: "غرفة سائق",
                private_roof: 'السقف الخاص',
                playground: 'الملعب'
            },
            customRange: 'نطاق مخصص',
            minPrice: 'السعر الأدنى',
            maxPrice: 'السعر الأعلى',
            apply: 'تطبيق',
            back: 'رجوع',
            reset: 'إعادة تعيين',
            areaRanges: {
                all: 'أي مساحة',
                '0-100': 'حتى 100 م²',
                '100-200': '100 - 200 م²',
                '200-300': '200 - 300 م²',
                '300-500': '300 - 500 م²',
                '500-1000': '500 - 1,000 م²',
                '1000': 'أكثر من 1,000 م²'
            }
        }
    }

    const t = content[language]

    const handleAmenityToggle = (amenity) => {
        const newAmenities = activeFilters.amenities.includes(amenity)
            ? activeFilters.amenities.filter(a => a !== amenity)
            : [...activeFilters.amenities, amenity]
        
        onFilterChange({ amenities: newAmenities })
    }

    const resetFilters = () => {
        onFilterChange({
            type: 'all',
            priceRange: 'all',
            bedrooms: 'all',
            amenities: [],
            location: 'all'
        })
    }

    const handleCustomPriceChange = () => {
        const range = customPrice.max 
            ? `${customPrice.min}-${customPrice.max}`
            : `${customPrice.min}`
        onFilterChange({ priceRange: range })
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Property Type */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                        language === 'ar' ? 'font-arabic' : ''
                    }`}>
                        {t.propertyType}
                    </h3>
                    <select
                        value={activeFilters.type}
                        onChange={(e) => onFilterChange({ type: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        {Object.entries(t.types).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                    <h3 className={`text-lg font-semibold ${
                        language === 'ar' ? 'font-arabic' : ''
                    }`}>
                        {t.priceRange}
                    </h3>
                    
                    {!showCustomRange ? (
                        <>
                            <select
                                value={activeFilters.priceRange}
                                onChange={(e) => {
                                    if (e.target.value === 'custom') {
                                        setShowCustomRange(true)
                                    } else {
                                        onFilterChange({ priceRange: e.target.value })
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                            >
                                {Object.entries(t.priceRanges).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                                <option value="custom">{t.customRange}</option>
                            </select>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        placeholder={t.minPrice}
                                        value={customPrice.min}
                                        onChange={(e) => setCustomPrice(prev => ({
                                            ...prev,
                                            min: e.target.value
                                        }))}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        placeholder={t.maxPrice}
                                        value={customPrice.max}
                                        onChange={(e) => setCustomPrice(prev => ({
                                            ...prev,
                                            max: e.target.value
                                        }))}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => {
                                        setShowCustomRange(false)
                                        setCustomPrice({ min: '', max: '' })
                                        onFilterChange({ priceRange: 'all' })
                                    }}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    ← {t.back}
                                </button>
                                <button
                                    onClick={handleCustomPriceChange}
                                    className="text-sm text-primary hover:text-primary-hover"
                                    disabled={!customPrice.min}
                                >
                                    {t.apply}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bedrooms */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                        language === 'ar' ? 'font-arabic' : ''
                    }`}>
                        {t.bedrooms}
                    </h3>
                    <select
                        value={activeFilters.bedrooms}
                        onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        {Object.entries(t.bedroomOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                        language === 'ar' ? 'font-arabic' : ''
                    }`}>
                        {t.location}
                    </h3>
                    <select
                        value={activeFilters.location}
                        onChange={(e) => onFilterChange({ location: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        {Object.entries(t.locations).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Area Range Filter */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                        language === 'ar' ? 'font-arabic' : ''
                    }`}>
                        {t.area}
                    </h3>
                    <select
                        value={activeFilters.areaRange}
                        onChange={(e) => onFilterChange({ areaRange: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        {Object.entries(t.areaRanges).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Amenities with categorized layout */}
            <div className="mt-6">
                <h3 className={`text-lg font-semibold mb-3 ${
                    language === 'ar' ? 'font-arabic' : ''
                }`}>
                    {t.amenities}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(t.amenityCategories).map(([category, amenities]) => (
                        <div key={category} className="space-y-3">
                            <h4 className="font-medium text-gray-700">{category}</h4>
                            <div className="space-y-2">
                                {amenities.map(amenity => {
                                    const Icon = amenityIcons[amenity];
                                    return (
                                        <button
                                            key={amenity}
                                            onClick={() => handleAmenityToggle(amenity)}
                                            className={`flex items-center gap-2 w-full p-2 rounded-md border ${
                                                activeFilters.amenities.includes(amenity)
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-gray-300 hover:border-primary'
                                            }`}
                                        >
                                            {Icon && <Icon size={16} />}
                                            <span className="text-sm">{t.amenityLabels[amenity]}</span>
                                            {activeFilters.amenities.includes(amenity) && <FiCheck size={16} className="ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                    {t.reset}
                </button>
            </div>
        </div>
    )
} 