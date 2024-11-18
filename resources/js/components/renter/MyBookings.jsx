import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyBookings({ language }) {
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate()

  const content = {
    en: {
      title: 'My Bookings',
      noBookings: 'No bookings found.',
      browse: 'Browse Properties'
    },
    ar: {
      title: 'حجوزاتي',
      noBookings: 'لا توجد حجوزات.',
      browse: 'تصفح العقارات'
    }
  }

  const t = content[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 mb-4">{t.noBookings}</p>
        <button
          onClick={() => navigate('/properties/available')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          {t.browse}
        </button>
      </div>
    </div>
  )
} 