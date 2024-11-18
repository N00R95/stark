import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Tours({ language }) {
  const [tours, setTours] = useState([])
  const navigate = useNavigate()

  const content = {
    en: {
      title: 'My Tours',
      noTours: 'No tours scheduled yet.',
      schedule: 'Schedule a Tour'
    },
    ar: {
      title: 'جولاتي',
      noTours: 'لا توجد جولات مجدولة بعد.',
      schedule: 'جدول جولة'
    }
  }

  const t = content[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 mb-4">{t.noTours}</p>
        <button
          onClick={() => navigate('/properties/available')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          {t.schedule}
        </button>
      </div>
    </div>
  )
} 