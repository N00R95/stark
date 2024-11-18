import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'

export default function MyProperties({ language }) {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const content = {
    en: {
      title: 'My Properties',
      addProperty: 'Add New Property',
      noProperties: 'No properties listed yet',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      status: {
        booked: 'Booked',
        available: 'Available'
      },
      deleteConfirm: 'Are you sure you want to delete this property?',
      actions: 'Actions',
      columns: {
        image: 'Image',
        title: 'Title',
        type: 'Type',
        location: 'Location',
        price: 'Price',
        bookingStatus: 'Status'
      },
      confirmStatusUpdate: 'Are you sure you want to mark this property as'
    },
    ar: {
      title: 'عقاراتي',
      addProperty: 'إضافة عقار جديد',
      noProperties: 'لا توجد عقارات مدرجة بعد',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      status: {
        booked: 'محجوز',
        available: 'متاح'
      },
      deleteConfirm: 'هل أنت متأكد من حذف هذا العقار؟',
      actions: 'إجراءات',
      columns: {
        image: 'الصورة',
        title: 'العنوان',
        type: 'النوع',
        location: 'الموقع',
        price: 'السعر',
        bookingStatus: 'الحالة'
      },
      confirmStatusUpdate: 'هل أنت متأكد من تغيير حالة العقار إلى'
    }
  }

  const t = content[language]

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertyAPI.getOwnerProperties()
      if (response?.data) {
        setProperties(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await propertyAPI.deleteProperty(propertyId)
        setProperties(properties.filter(p => p.id !== propertyId))
      } catch (error) {
        console.error('Failed to delete property:', error)
      }
    }
  }

  const handleBookingStatusUpdate = async (propertyId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'booked' : 'available';
    const confirmMessage = `${t.confirmStatusUpdate} ${t.status[newStatus]}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await propertyAPI.updatePropertyStatus(propertyId, newStatus);
        setProperties(properties.map(property =>
          property.id === propertyId
            ? { ...property, bookingStatus: newStatus }
            : property
        ));
      } catch (error) {
        console.error('Failed to update property status:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className={`text-xl md:text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t.title}
        </h1>
        <button
          onClick={() => navigate('/owner/properties/add')}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          {t.addProperty}
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{t.noProperties}</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="hidden md:block min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">{t.columns.image}</th>
                  <th className="px-4 py-2 text-left">{t.columns.title}</th>
                  <th className="px-4 py-2 text-left">{t.columns.type}</th>
                  <th className="px-4 py-2 text-left">{t.columns.location}</th>
                  <th className="px-4 py-2 text-left">{t.columns.price}</th>
                  <th className="px-4 py-2 text-left">{t.columns.bookingStatus}</th>
                  <th className="px-4 py-2 text-left">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img
                        src={property.images[0] || 'https://placehold.co/100x100'}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{property.title}</td>
                    <td className="px-4 py-2">{property.type}</td>
                    <td className="px-4 py-2">{property.location}</td>
                    <td className="px-4 py-2">{property.price} SAR</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleBookingStatusUpdate(property.id, property.bookingStatus)}
                        className={`px-2 py-1 rounded-full text-xs ${
                          property.bookingStatus === 'booked'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {t.status[property.bookingStatus || 'available']}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/properties/${property.id}`)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                          title={t.view}
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => navigate(`/owner/properties/edit/${property.id}`)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title={t.edit}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title={t.delete}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="flex items-center p-4 border-b">
                  <img
                    src={property.images[0] || 'https://placehold.co/100x100'}
                    alt={property.title}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm">{property.type}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{t.columns.location}</span>
                    <span>{property.location}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{t.columns.price}</span>
                    <span className="font-semibold">{property.price} SAR</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{t.columns.bookingStatus}</span>
                    <button
                      onClick={() => handleBookingStatusUpdate(property.id, property.bookingStatus)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        property.bookingStatus === 'booked'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {t.status[property.bookingStatus || 'available']}
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title={t.view}
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => navigate(`/owner/properties/edit/${property.id}`)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title={t.edit}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title={t.delete}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 