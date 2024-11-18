import { NavLink } from 'react-router-dom'
import { FiUser, FiHome, FiPlusCircle, FiList } from 'react-icons/fi'

export default function OwnerSidebar({ language }) {
  const menuItems = {
    en: [
      { icon: <FiUser />, text: 'My Profile', path: '/owner/profile' },
      { icon: <FiHome />, text: 'My Properties', path: '/owner/properties', exact: true },
      { icon: <FiPlusCircle />, text: 'Add Property', path: '/owner/properties/add' },
      { icon: <FiList />, text: 'Tour Requests', path: '/owner/requests' },
    ],
    ar: [
      { icon: <FiUser />, text: 'ملفي الشخصي', path: '/owner/profile' },
      { icon: <FiHome />, text: 'عقاراتي', path: '/owner/properties', exact: true },
      { icon: <FiPlusCircle />, text: 'إضافة عقار', path: '/owner/properties/add' },
      { icon: <FiList />, text: 'طلبات الجولات', path: '/owner/requests' },
    ]
  }

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
      <nav className="space-y-2">
        {menuItems[language].map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => {
              if (item.exact && isActive) {
                return `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors bg-primary text-white`;
              }
              return `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`;
            }}
            end={item.exact}
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