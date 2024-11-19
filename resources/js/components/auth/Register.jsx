import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi'
import { authAPI } from '../../services/api'

export default function Register({ language, userType }) {
  const [step, setStep] = useState('phone')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  const content = {
    en: {
      renterTitle: 'Renter Registration',
      ownerTitle: 'Owner Registration',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      otp: 'Enter OTP',
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      loginLink: 'Already have an account? Login',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Please enter a valid phone number',
      otpRequired: 'OTP is required',
      otpInvalid: 'Please enter a valid OTP',
      resendOtp: 'Resend OTP',
      otpSent: 'OTP has been sent to your phone'
    },
    ar: {
      renterTitle: 'تسجيل مستأجر جديد',
      ownerTitle: 'تسجيل مالك جديد',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      otp: 'رمز التحقق',
      sendOtp: 'إرسال رمز التحقق',
      verifyOtp: 'تحقق من الرمز',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
      phoneRequired: 'رقم الهاتف مطلوب',
      phoneInvalid: 'الرجاء إدخال رقم هاتف صحيح',
      otpRequired: 'رمز التحقق مطلوب',
      otpInvalid: 'الرجاء إدخال رمز تحقق صحيح',
      resendOtp: 'إعادة إرسال الرمز',
      otpSent: 'تم إرسال رمز التحقق إلى هاتفك'
    }
  }

  const t = content[language]

  const validatePhone = () => {
    if (!formData.phone) {
      setError(t.phoneRequired)
      return false
    }
    const phoneRegex = /^(\+966|0)?5[0-9]{8}$/
    if (!phoneRegex.test(formData.phone)) {
      setError(t.phoneInvalid)
      return false
    }
    return true
  }

  const validateOtp = () => {
    if (!otp) {
      setError(t.otpRequired)
      return false
    }
    if (otp.length !== 6) {
      setError(t.otpInvalid)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePhone()) return

    setIsLoading(true)
    try {
        let formattedPhone = formData.phone
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = formattedPhone.startsWith('0')
                ? '+966' + formattedPhone.substring(1)
                : '+966' + formattedPhone
        }

        const response = await authAPI.sendOTP({
            phone: formattedPhone,
            channel: 'sms'
        })

        if (response.success) {
            sessionStorage.setItem('registerData', JSON.stringify({
                ...formData,
                phone: formattedPhone,
                type: userType
            }))
            setStep('otp')
            alert(t.otpSent)
        }
    } catch (error) {
        if (error.response?.data?.error_code === 'PROFILE_EXISTS') {
            setError('An account with this phone number already exists. Please login instead.')
        } else {
            setError(error.response?.data?.message || 'Failed to send OTP')
        }
    } finally {
        setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateOtp()) return

    setIsLoading(true)
    try {
        const savedData = JSON.parse(sessionStorage.getItem('registerData'))
        const response = await authAPI.registerVerifyOTP({
            full_name: savedData.name,
            email: savedData.email,
            phone: savedData.phone,
            type: userType,
            business_name: savedData.businessName,
            business_license: savedData.businessLicense,
            otp: otp
        })

        if (response.success) {
            if (response.token) {
                localStorage.setItem('token', response.token)
            }
            await checkAuth()
            sessionStorage.removeItem('registerData')

            if (userType === 'renter') {
                navigate('/properties/available')
            } else {
                navigate('/owner/properties/add')
            }
        }
    } catch (error) {
        console.error('OTP verification failed:', error)
        if (error.response?.data?.error_code === 'PROFILE_EXISTS') {
            setError('An account with this phone number already exists. Please login instead.')
        } else {
            setError(error.response?.data?.message || 'Invalid OTP')
        }
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-2xl sm:text-3xl font-extrabold text-gray-900 ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {userType === 'renter' ? t.renterTitle : t.ownerTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={step === 'phone' ? handleSubmit : handleVerifyOtp} className="space-y-4 sm:space-y-6">
            {step === 'phone' ? (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.name}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.email}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.phone}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 5XXXXXXXX"
                      dir="ltr"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.otp}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '...' : step === 'phone' ? t.sendOtp : t.verifyOtp}
              </button>
            </div>
          </form>

          {step === 'otp' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep('phone')}
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
              >
                {t.resendOtp}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to={`/login/${userType}`}
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {t.loginLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
