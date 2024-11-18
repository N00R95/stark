import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pic1 from '../assets/pic1.jpg'

export default function Partners({ language }) {
    const navigate = useNavigate()

    const content = {
        en: {
            title: 'Start Your Journey with Your Real Estate Advisor',
            subtitle: 'We find the best options for you whether you are a property owner or tenant',
            renter: 'Register as Renter',
            owner: 'Register as Owner'
        },
        ar: {
            title: 'ابدا رحلتك مع مستشارك العقاري',
            subtitle: 'نحن نبحث لك عن افضل الخيارات سواء كنت صاحب عقار او مستأجر',
            renter: 'سجل كمستأجر',
            owner: 'سجل كمالك'
        }
    }

    const t = content[language]

    const handleButtonClick = (type) => {
        navigate(`/register/${type}`)
    }

    return (
        <section 
            className="py-16"
            style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(153, 109, 109, 0.2) 50%, #FFFFFF 100%)'
            }}
        >
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 max-w-6xl mx-auto">
                    {/* Image Column */}
                    <div className="order-2 md:order-1 px-4 md:px-8">
                        <div className="aspect-square bg-white/50 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
                            <div className="w-full h-full flex items-center justify-center">
                                <img 
                                    src={pic1} 
                                    alt="Real Estate" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="order-1 md:order-2 flex flex-col justify-center px-4 md:px-8">
                        <div className="max-w-xl">
                            <h2 className={`text-3xl font-bold mb-4 ${
                                language === 'ar' ? 'font-arabic' : ''
                            }`}>
                                {t.title}
                            </h2>
                            <p className={`text-gray-600 text-lg mb-8 ${
                                language === 'ar' ? 'font-arabic' : ''
                            }`}>
                                {t.subtitle}
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => handleButtonClick('renter')} 
                                    className="bg-[#BE092B]/90 text-white px-4 py-2 rounded-lg text-sm hover:bg-[#8a1328] transition-colors duration-200"
                                >
                                    {t.renter}
                                </button>
                                <button 
                                    onClick={() => handleButtonClick('owner')} 
                                    className="bg-[#BE092B]/90 text-white px-4 py-2 rounded-lg text-sm hover:bg-[#8a1328] transition-colors duration-200"
                                >
                                    {t.owner}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}