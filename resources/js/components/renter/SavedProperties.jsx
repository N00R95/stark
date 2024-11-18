import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SavedProperties({ language }) {
  const [savedProperties, setSavedProperties] = useState([])
  const navigate = useNavigate()

  const content = {
    en: {
      title: 'Saved Properties',
      noProperties: 'No saved properties found.',
      browse: 'Browse Properties'
    },
    ar: {
      title: 'العقارات المحفوظة',
      noProperties: 'لا توجد عقارات محفوظة.',
      browse: 'تصفح العقارات'
    }
  }

  const t = content[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 mb-4">{t.noProperties}</p>
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