import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiEdit2, FiSave, FiX } from 'react-icons/fi'

export default function Profile({ language }) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.profile?.full_name || '',
    email: user?.profile?.email || '',
    phone: user?.profile?.phone || '',
    businessName: user?.profile?.business_name || '',
    businessLicense: user?.profile?.business_license || '',
    address: user?.profile?.address || ''
  })

  const content = {
    en: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      businessInfo: 'Business Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      businessName: 'Business Name',
      businessLicense: 'Business License Number',
      address: 'Business Address',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
      success: 'Profile updated successfully'
    },
    ar: {
      title: 'ملفي الشخصي',
      personalInfo: 'المعلومات الشخصية',
      businessInfo: 'معلومات العمل',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      businessName: 'اسم الشركة',
      businessLicense: 'رقم الرخصة التجارية',
      address: 'عنوان العمل',
      edit: 'تعديل الملف',
      save: 'حفظ التغييرات',
      cancel: 'إلغاء',
      success: 'تم تحديث الملف الشخصي بنجاح'
    }
  }

  const t = content[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // API call to update profile
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsEditing(false)
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t.title}
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            <FiEdit2 />
            {t.edit}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.personalInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fullName}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-gray-900">{formData.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <p className="text-gray-900">{formData.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.phone}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-gray-900">{formData.phone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.businessInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.businessName}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-gray-900">{formData.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.businessLicense}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessLicense}
                  onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-gray-900">{formData.businessLicense}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.address}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-gray-900">{formData.address}</p>
              )}
            </div>
          </div>
        </section>

        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <FiX />
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              <FiSave />
              {t.save}
            </button>
          </div>
        )}
      </form>
    </div>
  )
} 