import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../services/api'
import {
    FiMaximize,
    FiMap,
    FiCalendar,
    FiHeart,
    FiShare,
    FiCheck,
    FiHome
} from 'react-icons/fi'
import {
    IoBedOutline,
    IoWaterOutline,
    IoLocationOutline,
    IoCalendarOutline,
    IoBusinessOutline
} from "react-icons/io5"
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
import BookingForm from './BookingForm'

export default function PropertyDetails({ language }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [showBooking, setShowBooking] = useState(false)

    const content = {
        en: {
            loading: 'Loading property details...',
            error: 'Failed to load property details',
            features: 'Features',
            amenities: 'Amenities',
            location: 'Location',
            price: 'Price',
            type: 'Property Type',
            bedrooms: 'Bedrooms',
            bathrooms: 'Bathrooms',
            area: 'Area',
            built: 'Built Year',
            book: 'Book a Tour',
            save: 'Save Property',
            share: 'Share',
            backToList: 'Back to Properties',
            propertyDetails: 'Property Details',
            description: 'Description',
            yes: 'Yes',
            no: 'No',
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
                electricity: 'Electricity',
                water: 'Water',
                sewage: 'Sewage',
                reception: 'Reception',
                meeting_rooms: 'Meeting Rooms',
                private_roof: 'Private Roof',
                driver_rooms: "Driver's Room",
                playground: 'Playground'
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
            }
        },
        ar: {
            loading: 'جاري تحميل تفاصيل العقار...',
            error: 'فشل في تحميل تفاصيل العقار',
            features: 'المميزات',
            amenities: 'المرافق',
            location: 'الموقع',
            price: 'السعر',
            type: 'نوع العقار',
            bedrooms: 'غرف النوم',
            bathrooms: 'دورات المياه',
            area: 'المساحة',
            built: 'سنة البناء',
            book: 'حجز معاينة',
            save: 'حفظ العقار',
            share: 'مشاركة',
            backToList: 'العودة للقائمة',
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
                electricity: 'كهرباء',
                water: 'ماء',
                sewage: 'صرف صحي',
                reception: 'استقبال',
                meeting_rooms: 'غرف اجتماعات',
                private_roof: 'سطح خاص',
                driver_rooms: 'غرفة سائق',
                playground: 'ملعب'
            },
            amenityCategories: {
                'المميزات الأساسية': [
                    'central_ac',
                    'parking',
                    'elevator',
                    'security'
                ],
                'الراحة والملاءمة': [
                    'furnished',
                    'kitchen_appliances',
                    'balcony',
                    'storage'
                ],
                'الترفيه والاستجمام': [
                    'swimming_pool',
                    'gym',
                    'garden',
                    'playground'
                ],
                'الخدمات والمرافق': [
                    'internet',
                    'satellite',
                    'intercom',
                    'maintenance'
                ],
                'المرافق القريبة': [
                    'mosque',
                    'shopping',
                    'schools'
                ],
                'مميزات إضافية': [
                    'maid_room',
                    'driver_rooms',
                    'private_roof',
                    'pets_allowed'
                ]
            }
        }
    }

    const t = content[language]

    useEffect(() => {
        fetchPropertyDetails()
    }, [id])

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true)
            const response = await propertyAPI.getPropertyDetails(id)
            if (response?.data) {
                setProperty(response.data)
            } else {
                throw new Error('Property not found')
            }
        } catch (error) {
            console.error('Failed to fetch property details:', error)
            setError(t.error)
            setTimeout(() => {
                navigate('/properties/available')
            }, 3000)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-600">{t.loading}</p>
            </div>
        )
    }

    if (error || !property) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        )
    }

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
    }

    const featureIcons = {
        type: IoBusinessOutline,
        bedrooms: IoBedOutline,
        bathrooms: IoWaterOutline,
        area: FiMaximize,
        location: IoLocationOutline,
        built: IoCalendarOutline
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Navigation */}
            <button
                onClick={() => navigate('/properties/available')}
                className="mb-6 text-primary hover:text-primary-hover flex items-center gap-2"
            >
                ← {t.backToList}
            </button>

            {/* Property Title */}
            <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''
                }`}>
                {property.title}
            </h1>

            {/* Updated Image Gallery without arrows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Main Image */}
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                    <img
                        src={property.images[selectedImage]}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 h-fit">
                    {property.images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative aspect-video cursor-pointer overflow-hidden rounded-lg ${selectedImage === index ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => setSelectedImage(index)}
                        >
                            <img
                                src={image}
                                alt={`${property.title} ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            {selectedImage === index && (
                                <div className="absolute inset-0 bg-primary/20" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {/* Basic Features */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''
                            }`}>
                            {t.features}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <FaBuilding className="text-primary" />
                                <span>{property.type}</span>
                            </div>
                            {property.bedrooms !== undefined && (
                                <div className="flex items-center gap-2">
                                    <IoBedOutline className="text-primary" />
                                    <span>{property.bedrooms} {t.bedrooms}</span>
                                </div>
                            )}
                            {property.bathrooms !== undefined && (
                                <div className="flex items-center gap-2">
                                    <IoWaterOutline className="text-primary" />
                                    <span>{property.bathrooms} {t.bathrooms}</span>
                                </div>
                            )}
                            {property.area !== undefined && (
                                <div className="flex items-center gap-2">
                                    <FiMaximize className="text-primary" />
                                    <span>{property.area} m²</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''
                            }`}>
                            {t.description}
                        </h2>
                        <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className={`text-2xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''
                            }`}>
                            {t.amenities}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.entries(t.amenityCategories).map(([category, amenities]) => {
                                // Filter available amenities in this category
                                const availableAmenities = amenities.filter(amenity =>
                                    property.amenities?.includes(amenity)
                                )

                                // Only show category if it has available amenities
                                if (availableAmenities.length === 0) return null

                                return (
                                    <div key={category} className="space-y-3">
                                        <h3 className="font-semibold text-gray-700">{category}</h3>
                                        <div className="space-y-2">
                                            {availableAmenities.map(amenity => {
                                                const Icon = amenityIcons[amenity]
                                                return (
                                                    <div
                                                        key={amenity}
                                                        className="flex items-center gap-2 text-gray-900"
                                                    >
                                                        {Icon && <Icon className="text-primary" />}
                                                        <span>{t.amenityLabels[amenity]}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-primary">
                                {property.price} SAR
                            </span>
                        </div>

                        <button
                            onClick={() => setShowBooking(true)}
                            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200 mb-4"
                        >
                            {t.book}
                        </button>

                        <div className="flex justify-between">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                                <FiHeart />
                                {t.save}
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                                <FiShare />
                                {t.share}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showBooking && (
                <BookingForm
                    language={language}
                    property={property}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </div>
    )
} 