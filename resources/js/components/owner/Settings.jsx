import { useState } from 'react'
import { FiSave, FiBell, FiGlobe, FiLock } from 'react-icons/fi'

export default function Settings({ language }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      tourRequests: true,
      messages: true,
      updates: false
    },
    privacy: {
      showPhone: true,
      showEmail: false,
      publicProfile: true
    },
    preferences: {
      language: 'en',
      currency: 'SAR',
      timeZone: 'Asia/Riyadh'
    }
  })

  const content = {
    en: {
      title: 'Settings',
      notifications: {
        title: 'Notifications',
        email: 'Email Notifications',
        sms: 'SMS Notifications',
        tourRequests: 'Tour Request Notifications',
        messages: 'Message Notifications',
        updates: 'Updates and Newsletter'
      },
      privacy: {
        title: 'Privacy',
        showPhone: 'Show Phone Number',
        showEmail: 'Show Email Address',
        publicProfile: 'Public Profile'
      },
      preferences: {
        title: 'Preferences',
        language: 'Language',
        currency: 'Currency',
        timeZone: 'Time Zone'
      },
      save: 'Save Changes',
      success: 'Settings updated successfully'
    },
    ar: {
      title: 'الإعدادات',
      notifications: {
        title: 'الإشعارات',
        email: 'إشعارات البريد الإلكتروني',
        sms: 'إشعارات الرسائل النصية',
        tourRequests: 'إشعارات طلبات الجولات',
        messages: 'إشعارات الرسائل',
        updates: 'التحديثات والنشرة الإخبارية'
      },
      privacy: {
        title: 'الخصوصية',
        showPhone: 'إظهار رقم الهاتف',
        showEmail: 'إظهار البريد الإلكتروني',
        publicProfile: 'الملف العام'
      },
      preferences: {
        title: 'التفضيلات',
        language: 'اللغة',
        currency: 'العملة',
        timeZone: 'المنطقة الزمنية'
      },
      save: 'حفظ التغييرات',
      success: 'تم تحديث الإعدادات بنجاح'
    }
  }

  const t = content[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // API call to update settings
      await new Promise(resolve => setTimeout(resolve, 500))
      // Show success message
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FiBell className="text-primary" />
            <h2 className={`text-xl font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.notifications.title}
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(t.notifications).map(([key, label]) => {
              if (key === 'title') return null
              return (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications[key]}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              )
            })}
          </div>
        </section>

        {/* Privacy */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FiLock className="text-primary" />
            <h2 className={`text-xl font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.privacy.title}
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(t.privacy).map(([key, label]) => {
              if (key === 'title') return null
              return (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.privacy[key]}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        [key]: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              )
            })}
          </div>
        </section>

        {/* Preferences */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FiGlobe className="text-primary" />
            <h2 className={`text-xl font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.preferences.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.preferences.language}
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    language: e.target.value
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.preferences.currency}
              </label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    currency: e.target.value
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            <FiSave />
            {t.save}
          </button>
        </div>
      </form>
    </div>
  )
} 