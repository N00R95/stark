import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Profile({ language }) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.profile?.full_name || '',
    email: user?.profile?.email || '',
    phone: user?.profile?.phone || '',
  })

  const content = {
    en: {
      title: 'My Profile',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel'
    },
    ar: {
      title: 'ملفي الشخصي',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      edit: 'تعديل الملف',
      save: 'حفظ التغييرات',
      cancel: 'إلغاء'
    }
  }

  const t = content[language]

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        fullName: user.profile.full_name || '',
        email: user.profile.email || '',
        phone: user.profile.phone || '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (!user?.profile) {
    return <div>Loading...</div>
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
            className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            {t.edit}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary-hover"
            >
              {t.save}
            </button>
          </div>
        )}
      </form>
    </div>
  )
} 