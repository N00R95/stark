import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RenterRegistration({ language }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    preferredLocation: '',
  })

  const navigate = useNavigate()

  const content = {
    en: {
      title: 'Renter Registration',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone Number',
      preferredLocation: 'Preferred Location',
      submit: 'Register',
      loginLink: 'Already have an account? Login',
    },
    ar: {
      title: 'تسجيل المستأجر',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      phone: 'رقم الهاتف',
      preferredLocation: 'الموقع المفضل',
      submit: 'تسجيل',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
    },
  }

  const t = content[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add registration logic here
    try {
      // API call to register renter
      navigate('/renter/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {t.title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Form fields */}
            <div>
              <label
                htmlFor="fullName"
                className={`block text-sm font-medium text-gray-700 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
              >
                {t.fullName}
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            {/* Add other form fields similarly */}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 