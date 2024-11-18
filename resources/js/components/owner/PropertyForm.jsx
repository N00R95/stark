import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiUpload, FiX } from 'react-icons/fi'

export default function PropertyForm({ language }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    yearBuilt: '',
    furnished: false,
    views: [],
    amenities: [],
    images: []
  })
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const content = {
    en: {
      title: id ? 'Edit Property' : 'Add New Property',
      propertyDetails: 'Property Details',
      propertyType: 'Property Type',
      location: 'Location',
      specifications: 'Specifications',
      amenities: 'Amenities',
      additionalFeatures: 'Additional Features',
      images: 'Property Images',
      submit: id ? 'Update Property' : 'Add Property',
      cancel: 'Cancel',
      fields: {
        title: 'Property Title',
        description: 'Description',
        type: 'Type',
        price: 'Price (SAR)',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        area: 'Area (m²)',
        location: 'Location',
        yearBuilt: 'Year Built',
        furnished: 'Furnished'
      },
      types: {
        apartment: 'Apartment',
        villa: 'Villa',
        office: 'Office',
        shop: 'Shop',
        land: 'Land'
      },
      locations: {
        riyadh: 'Riyadh',
        jeddah: 'Jeddah',
        dammam: 'Dammam',
        khobar: 'Khobar'
      },
      views: {
        'sea view': 'Sea View',
        'city view': 'City View',
        'garden view': 'Garden View',
        'street view': 'Street View',
        'mall view': 'Mall View'
      },
      amenityOptions: {
        parking: 'Parking',
        'swimming_pool': 'Swimming Pool',
        gym: 'Gym',
        security: '24/7 Security',
        elevator: 'Elevator',
        garden: 'Garden',
        'central_ac': 'Central AC',
        balcony: 'Balcony',
        'maid_room': "Maid's Room",
        storage: 'Storage Room',
        'kitchen_appliances': 'Kitchen Appliances',
        internet: 'Internet',
        satellite: 'Satellite/Cable TV',
        intercom: 'Intercom',
        maintenance: 'Maintenance',
        mosque: 'Nearby Mosque',
        shopping: 'Shopping Centers',
        schools: 'Schools Nearby',
        'pets_allowed': 'Pets Allowed'
      },
      dragDrop: 'Drag and drop images here, or click to select',
      maxFiles: 'Maximum 10 images'
    },
    ar: {
      title: id ? 'تعديل العقار' : 'إضافة عقار جديد',
      propertyDetails: 'تفاصيل العقار',
      propertyType: 'نوع العقار',
      location: 'الموقع',
      specifications: 'المواصفات',
      amenities: 'المميزات',
      additionalFeatures: 'مميزات إضافية',
      images: 'صور العقار',
      submit: id ? 'تحديث العقار' : 'إضافة العقار',
      cancel: 'إلغاء',
      fields: {
        title: 'عنوان العقار',
        description: 'الوصف',
        type: 'النوع',
        price: 'السعر (ريال)',
        bedrooms: 'غرف النوم',
        bathrooms: 'دورات المياه',
        area: 'المساحة (م²)',
        location: 'الموقع',
        yearBuilt: 'سنة البناء',
        furnished: 'مفروش'
      },
      types: {
        apartment: 'شقة',
        villa: 'فيلا',
        office: 'مكتب',
        shop: 'محل',
        land: 'أرض'
      },
      locations: {
        riyadh: 'الرياض',
        jeddah: 'جدة',
        dammam: 'الدمام',
        khobar: 'الخبر'
      },
      views: {
        'sea view': 'إطلالة بحرية',
        'city view': 'إطلالة على المدينة',
        'garden view': 'إطلالة على الحديقة',
        'street view': 'إطلالة على الشارع',
        'mall view': 'إطلالة على المول'
      },
      amenityOptions: {
        parking: 'موقف سيارات',
        'swimming_pool': 'مسبح',
        gym: 'صالة رياضية',
        security: 'أمن 24/7',
        elevator: 'مصعد',
        garden: 'حديقة',
        'central_ac': 'تكييف مركزي',
        balcony: 'شرفة',
        'maid_room': 'غرفة خادمة',
        storage: 'غرفة تخزين',
        'kitchen_appliances': 'أجهزة مطبخ',
        internet: 'إنترنت',
        satellite: 'قنوات فضائية',
        intercom: 'اتصال داخلي',
        maintenance: 'صيانة',
        mosque: 'مسجد قريب',
        shopping: 'مراكز تسوق',
        schools: 'مدارس قريبة',
        'pets_allowed': 'يسمح بالحيوانات الأليفة'
      },
      dragDrop: 'اسحب وأفلت الصور هنا، أو انقر للاختيار',
      maxFiles: 'الحد الأقصى 10 صور'
    }
  }

  const t = content[language]

  useEffect(() => {
    if (id) {
      fetchPropertyData()
    }
  }, [id])

  const fetchPropertyData = async () => {
    try {
      setLoading(true)
      // API call to get property data
      const response = await propertyAPI.getPropertyDetails(id)
      if (response?.data) {
        setFormData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        yearBuilt: parseInt(formData.yearBuilt)
      }

      if (id) {
        await propertyAPI.updateProperty(id, propertyData)
        setSubmitStatus({
          success: true,
          message: language === 'ar' ? 'تم تحديث العقار بنجاح' : 'Property updated successfully'
        })
      } else {
        await propertyAPI.createProperty(propertyData)
        setSubmitStatus({
          success: true,
          message: language === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully'
        })
      }
      
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate('/owner/properties')
      }, 2000)
    } catch (error) {
      console.error('Failed to save property:', error)
      setSubmitStatus({
        success: false,
        message: language === 'ar' ? 'حدث خطأ أثناء حفظ العقار' : 'Failed to save property'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.images.length > 10) {
      alert(t.maxFiles)
      return
    }
    
    // Handle image upload logic
    const newImages = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Details */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.propertyDetails}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.title}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.description}
              </label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.type}
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Select Type</option>
                {Object.entries(t.types).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.price}
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.specifications}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.bedrooms}
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.bathrooms}
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.area}
              </label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.amenities}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(t.amenityOptions).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(value)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...formData.amenities, value]
                      : formData.amenities.filter(a => a !== value)
                    setFormData({ ...formData, amenities: newAmenities })
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Additional Features */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.additionalFeatures}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(t.views).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.views.includes(value)}
                  onChange={(e) => {
                    const newViews = e.target.checked
                      ? [...formData.views, value]
                      : formData.views.filter(v => v !== value)
                    setFormData({ ...formData, views: newViews })
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Images */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.images}
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FiUpload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-600">{t.dragDrop}</span>
              <span className="text-sm text-gray-500">{t.maxFiles}</span>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/owner/properties')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? '...' : t.submit}
          </button>
        </div>
      </form>

      {submitStatus.message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${
          submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}
    </div>
  )
} 