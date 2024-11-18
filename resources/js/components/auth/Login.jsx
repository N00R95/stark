import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiPhone, FiLock } from 'react-icons/fi'

export default function Login({ language, userType }) {
    const [step, setStep] = useState('phone')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login, verifyOTP } = useAuth()
    const navigate = useNavigate()

    const content = {
        en: {
            renterTitle: 'Renter Login',
            ownerTitle: 'Owner Login',
            phone: 'Phone Number',
            otp: 'Enter OTP',
            sendOtp: 'Send OTP',
            verifyOtp: 'Verify OTP',
            registerLink: "Don't have an account? Register",
            phoneRequired: 'Phone number is required',
            phoneInvalid: 'Please enter a valid phone number',
            otpRequired: 'OTP is required',
            otpInvalid: 'Please enter a valid OTP',
            resendOtp: 'Resend OTP',
            otpSent: 'OTP has been sent to your phone'
        },
        ar: {
            renterTitle: 'تسجيل دخول المستأجر',
            ownerTitle: 'تسجيل دخول المالك',
            phone: 'رقم الهاتف',
            otp: 'رمز التحقق',
            sendOtp: 'إرسال رمز التحقق',
            verifyOtp: 'تحقق من الرمز',
            registerLink: 'ليس لديك حساب؟ سجل الآن',
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
        if (!phoneNumber) {
            setError(t.phoneRequired)
            return false
        }
        const phoneRegex = /^(\+966|0)?5[0-9]{8}$/
        if (!phoneRegex.test(phoneNumber)) {
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

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setError('')

        if (!validatePhone()) return

        setIsLoading(true)
        try {
            let formattedPhone = phoneNumber
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = formattedPhone.startsWith('0')
                    ? '+966' + formattedPhone.substring(1)
                    : '+966' + formattedPhone
            }

            const response = await login(formattedPhone)
            if (response.success) {
                sessionStorage.setItem('loginPhone', formattedPhone)
                setStep('otp')
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message)
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
            const phone = sessionStorage.getItem('loginPhone')
            const response = await verifyOTP(phone, otp, userType)

            if (response.success) {
                sessionStorage.removeItem('loginPhone')
                if (userType === 'renter') {
                    navigate('/properties/available')
                } else {
                    navigate('/owner/properties')
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className={`text-center text-2xl sm:text-3xl font-extrabold text-gray-900 ${
                    language === 'ar' ? 'font-arabic' : ''
                }`}>
                    {userType === 'renter' ? t.renterTitle : t.ownerTitle}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-6">
                        {step === 'phone' ? (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    {t.phone}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+966 5XXXXXXXX"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                    {t.otp}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="otp"
                                        type="text"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    step === 'phone' ? t.sendOtp : t.verifyOtp
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to={`/register/${userType}`}
                                className="font-medium text-primary hover:text-primary-hover"
                            >
                                {t.registerLink}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
