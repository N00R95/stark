import { useState } from 'react'
import { FiMessageCircle, FiPhone, FiMail, FiClock } from 'react-icons/fi'

export default function CustomerService({ language }) {
    const [activeTab, setActiveTab] = useState('contact')

    const content = {
        en: {
            title: 'Customer Service',
            subtitle: 'We\'re here to help',
            contact: 'Contact Us',
            faq: 'FAQ',
            support: 'Support Hours',
            phone: '+966 XX XXX XXXX',
            email: 'support@example.com',
            hours: '24/7 Support',
            form: {
                name: 'Full Name',
                email: 'Email',
                message: 'Message',
                submit: 'Send Message'
            },
            faqItems: [
                {
                    q: 'How do I schedule a property viewing?',
                    a: 'You can schedule a viewing by clicking the "Book a Tour" button on any property listing.'
                },
                {
                    q: 'What documents do I need for renting?',
                    a: 'Typically, you\'ll need valid ID, proof of income, and employment verification.'
                },
                // Add more FAQ items
            ]
        },
        ar: {
            title: 'خدمة العملاء',
            subtitle: 'نحن هنا للمساعدة',
            contact: 'اتصل بنا',
            faq: 'الأسئلة الشائعة',
            support: 'ساعات الدعم',
            phone: '+966 XX XXX XXXX',
            email: 'support@example.com',
            hours: 'دعم على مدار الساعة',
            form: {
                name: 'الاسم الكامل',
                email: 'البريد الإلكتروني',
                message: 'الرسالة',
                submit: 'إرسال الرسالة'
            },
            faqItems: [
                {
                    q: 'كيف يمكنني جدولة معاينة العقار؟',
                    a: 'يمكنك جدولة معاينة بالنقر على زر "حجز جولة" في أي قائمة عقارية.'
                },
                {
                    q: 'ما المستندات المطلوبة للإيجار؟',
                    a: 'عادةً، ستحتاج إلى هوية سارية، وإثبات دخل، وتحقق من التوظيف.'
                },
                // Add more FAQ items
            ]
        }
    }

    const t = content[language]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className={`text-3xl font-bold mb-4 ${
                    language === 'ar' ? 'font-arabic' : ''
                }`}>
                    {t.title}
                </h1>
                <p className="text-gray-600">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiPhone className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t.phone}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiMail className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t.email}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiClock className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t.hours}</h3>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="flex border-b">
                    <button
                        className={`flex-1 px-6 py-3 text-center ${
                            activeTab === 'contact'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('contact')}
                    >
                        {t.contact}
                    </button>
                    <button
                        className={`flex-1 px-6 py-3 text-center ${
                            activeTab === 'faq'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('faq')}
                    >
                        {t.faq}
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'contact' ? (
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.name}
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.email}
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.message}
                                </label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                            >
                                {t.form.submit}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {t.faqItems.map((item, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold mb-2">{item.q}</h3>
                                    <p className="text-gray-600">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 