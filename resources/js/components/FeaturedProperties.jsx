import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { FiMaximize, FiHeart } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline, IoLocationOutline } from "react-icons/io5";

export default function FeaturedProperties({ language }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await propertyAPI.getAvailable();
      if (response.success && response.data) {
        // Get first 3 properties
        setProperties(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    en: {
      title: 'Featured Properties',
      subtitle: 'Discover our hand-picked premium properties',
      viewAll: 'View All Properties',
      new: 'New',
      featured: 'Featured',
      viewDetails: 'View Details',
      save: 'Save',
      from: 'From',
      amenities: {
        pool: 'Swimming Pool',
        garden: 'Garden',
        security: '24/7 Security',
        parking: 'Parking',
        gym: 'Gym',
        elevator: 'Elevator',
        balcony: 'Balcony',
        maid_room: "Maid's Room",
        storage: 'Storage',
        reception: 'Reception',
        meeting_rooms: 'Meeting Rooms',
        driver_room: "Driver's Room",
        playground: 'Playground',
        electricity: 'Electricity',
        water: 'Water',
        sewage: 'Sewage',
        private_roof: 'Private Roof'
      }
    },
    ar: {
      title: 'عقارات مميزة',
      subtitle: 'اكتشف عقاراتنا المميزة المختارة بعناية',
      viewAll: 'عرض جميع العقارات',
      new: 'جديد',
      featured: 'مميز',
      viewDetails: 'عرض التفاصيل',
      save: 'حفظ',
      from: 'من',
      amenities: {
        pool: 'مسبح',
        garden: 'حديقة',
        security: 'أمن 24/7',
        parking: 'موقف سيارات',
        gym: 'صالة رياضية',
        elevator: 'مصعد',
        balcony: 'شرفة',
        maid_room: 'غرفة خادمة',
        storage: 'مخزن',
        reception: 'استقبال',
        meeting_rooms: 'قاعات اجتماعات',
        driver_room: 'غرفة سائق',
        playground: 'ملعب',
        electricity: 'كهرباء',
        water: 'ماء',
        sewage: 'صرف صحي',
        private_roof: 'سطح خاص'
      }
    }
  };

  const t = content[language || 'en'] || content['en'];

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative">
        <img
          src={property.images[0] || 'https://placehold.co/600x400/png/white?text=Property'}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        <button
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle save
          }}
        >
          <FiHeart className="text-[#BE092B]" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <IoLocationOutline className="text-[#BE092B]" />
          <span>{property.location}</span>
        </div>

        <h3 className="text-xl font-semibold mb-4 line-clamp-2 text-gray-800">{property.title}</h3>

        <div className="flex items-center gap-4 mb-4 text-gray-600">
          {property.bedrooms !== null && (
            <div className="flex items-center gap-1">
              <IoBedOutline className="text-[#BE092B]" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <IoWaterOutline className="text-[#BE092B]" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FiMaximize className="text-[#BE092B]" />
            <span>{property.area} m²</span>
          </div>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity.id}
                className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100"
              >
                {amenity.title}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-500 text-sm">{t.from}</span>
            <p className="text-[#BE092B] font-bold text-xl">
              {property.price} SAR
            </p>
          </div>
          <button
            onClick={() => navigate(`/properties/${property.id}`)}
            className="px-4 py-2 bg-[#BE092B]/90 text-white rounded-lg hover:bg-[#8a1328] transition-colors"
          >
            {t.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.title}
          </h2>
          <p className={`text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-gray-300 h-64 rounded-t-lg"></div>
                <div className="bg-white p-6 rounded-b-lg">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/properties/available')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                {t.viewAll}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
