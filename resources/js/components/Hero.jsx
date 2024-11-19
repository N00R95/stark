import { useNavigate } from 'react-router-dom'
import pic1 from '../assets/pic1.jpg'

export default function Hero({ language = 'en' }) {
  const navigate = useNavigate()

  const content = {
    en: {
      mainTitle: 'Find Your Perfect Home',
      title: 'Start Your Journey with Your Real Estate Advisor',
      subtitle: 'We find the best options for you whether you are a property owner or tenant',
      renter: 'Register as Renter',
      owner: 'Register as Owner'
    },
    ar: {
      mainTitle: 'ابحث عن منزلك المثالي',
      title: 'ابدا رحلتك مع مستشارك العقاري',
      subtitle: 'نحن نبحث لك عن افضل الخيارات سواء كنت صاحب عقار او مستأجر',
      renter: 'سجل كمستأجر',
      owner: 'سجل كمالك'
    }
  }

  const t = content[language] || content['en']

  const handleButtonClick = (type) => {
    navigate(`/register/${type}`)
  }

  return (
    <section
      className="py-8 md:py-16"
      style={{
        background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(153, 109, 109, 0.2) 50%, #FFFFFF 100%)'
      }}
    >
      <h1 className={`text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 pt-8 md:pt-16 px-4 ${
        language === 'ar' ? 'font-arabic' : ''
      }`}>
        {t.mainTitle}
      </h1>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 max-w-6xl mx-auto">
          {/* Image Column */}
          <div className="order-2 md:order-1 px-4 md:px-8">
            <div className="aspect-square bg-white/50 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={pic1}
                  alt="Real Estate"
                  className="w-full h-full object-cover"
                  loading="eager" // Load hero image immediately
                />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 md:order-2 flex flex-col justify-center px-4 md:px-8">
            <div className="max-w-xl">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {t.title}
              </h2>
              <p className={`text-base md:text-lg text-gray-600 mb-8 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {t.subtitle}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleButtonClick('renter')}
                  className="w-full sm:w-auto bg-[#BE092B]/90 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#8a1328] transition-colors duration-200"
                >
                  {t.renter}
                </button>
                <button
                  onClick={() => handleButtonClick('owner')}
                  className="w-full sm:w-auto bg-[#BE092B]/90 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#8a1328] transition-colors duration-200"
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
