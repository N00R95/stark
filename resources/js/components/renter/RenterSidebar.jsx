import { NavLink } from 'react-router-dom'
import { FiUser, FiCalendar, FiHome, FiHeart } from 'react-icons/fi'

export default function RenterSidebar({ language }) {
  const menuItems = {
    en: [
      { icon: <FiUser />, text: 'My Profile', path: '/renter/profile' },
      { icon: <FiCalendar />, text: 'My Tours', path: '/renter/tours' },
      { icon: <FiHome />, text: 'My Bookings', path: '/renter/bookings' },
      { icon: <FiHeart />, text: 'Saved Properties', path: '/renter/saved' },
    ],
    ar: [
      { icon: <FiUser />, text: 'ملفي الشخصي', path: '/renter/profile' },
      { icon: <FiCalendar />, text: 'جولاتي', path: '/renter/tours' },
      { icon: <FiHome />, text: 'حجوزاتي', path: '/renter/bookings' },
      { icon: <FiHeart />, text: 'العقارات المحفوظة', path: '/renter/saved' },
    ]
  }

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
      <nav className="space-y-2">
        {menuItems[language].map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {item.icon}
            <span className={language === 'ar' ? 'font-arabic' : ''}>
              {item.text}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
} 