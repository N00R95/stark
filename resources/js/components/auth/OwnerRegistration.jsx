import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiUser, FiMail, FiPhone, FiBriefcase, FiFileText } from 'react-icons/fi'
import { authAPI } from '../../services/api'

export default function OwnerRegistration({ language }) {
  const [step, setStep] = useState('phone')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessLicense: ''
  })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  const content = {
    en: {
      title: 'Property Owner Registration',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      businessName: 'Business Name',
      businessLicense: 'Business License Number',
      otp: 'Enter OTP',
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      loginLink: 'Already have an account? Login',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Please enter a valid Saudi phone number',
      otpRequired: 'OTP is required',
      otpInvalid: 'Please enter a valid 6-digit OTP',
      resendOtp: 'Resend OTP',
      otpSent: 'OTP has been sent to your phone'
    },
    ar: {
      title: 'تسجيل مالك العقار',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      businessName: 'اسم الشركة',
      businessLicense: 'رقم الرخصة التجارية',
      otp: 'أدخل OTP',
      sendOtp: 'إرسال OTP',
      verifyOtp: 'تأكيد OTP',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
      phoneRequired: 'رقم الهاتف مطلوب',
      phoneInvalid: 'الرجاء إدخال رقم هاتف سعودي صحيح',
      otpRequired: 'OTP مطلوب',
      otpInvalid: 'الرجاء إدخال OTP الصحيح 6 رقم',
      resendOtp: 'إعادة إرسال OTP',
      otpSent: 'OTP تم إرساله إلى هاتفك'
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
          type: 'owner',
          businessName: formData.businessName,
          businessLicense: formData.businessLicense
        }))
        setStep('otp')
        alert(t.otpSent)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP')
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
      const response = await authAPI.verifyRegisterOTP({
        full_name: savedData.name,
        email: savedData.email,
        phone: savedData.phone,
        type: 'owner',
        business_name: savedData.businessName,
        business_license: savedData.businessLicense,
        otp: otp
      })

      if (response.success) {
        localStorage.setItem('token', response.token)
        await checkAuth()
        sessionStorage.removeItem('registerData')
        navigate('/owner/properties/add')
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
      setError(error.response?.data?.message || 'Invalid OTP')
    } finally {
      setIsLoading(false)
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
            {/* Form fields similar to RenterRegistration but with owner-specific fields */}
            {/* ... */}
          </form>
        </div>
      </div>
    </div>
  )
} 