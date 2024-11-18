import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX, FiPhone, FiMail } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'

export default function TourRequests({ language }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTourRequests()
  }, [])

  const fetchTourRequests = async () => {
    try {
      setLoading(true)
      const response = await propertyAPI.getTourRequests()
      if (response?.data) {
        setRequests(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch tour requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const content = {
    en: {
      title: 'Tour Requests',
      noRequests: 'No tour requests',
      approve: 'Approve',
      reject: 'Reject',
      status: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected'
      },
      renterInfo: 'Renter Information',
      propertyInfo: 'Property Information',
      confirmApprove: 'Are you sure you want to approve this tour request?',
      confirmReject: 'Are you sure you want to reject this tour request?'
    },
    ar: {
      title: 'طلبات الجولات',
      noRequests: 'لا توجد طلبات جولات',
      approve: 'قبول',
      reject: 'رفض',
      status: {
        pending: 'قيد الانتظار',
        approved: 'تم القبول',
        rejected: 'تم الرفض'
      },
      renterInfo: 'معلومات المستأجر',
      propertyInfo: 'معلومات العقار',
      confirmApprove: 'هل أنت متأكد من قبول طلب الجولة؟',
      confirmReject: 'هل أنت متأكد من رفض طلب الجولة؟'
    }
  }

  const t = content[language]

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleApprove = async (requestId) => {
    if (window.confirm(t.confirmApprove)) {
      try {
        await propertyAPI.updateTourRequest(requestId, 'approved')
        setRequests(requests.map(request =>
          request.id === requestId
            ? { ...request, status: 'approved' }
            : request
        ))
      } catch (error) {
        console.error('Failed to approve request:', error)
      }
    }
  }

  const handleReject = async (requestId) => {
    if (window.confirm(t.confirmReject)) {
      try {
        await propertyAPI.updateTourRequest(requestId, 'rejected')
        setRequests(requests.map(request =>
          request.id === requestId
            ? { ...request, status: 'rejected' }
            : request
        ))
      } catch (error) {
        console.error('Failed to reject request:', error)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading tour requests...</p>
      ) : (
        <div className="space-y-6">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t.noRequests}</p>
          ) : (
            requests.map(request => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="p-4">
                  {/* Status Badge */}
                  <div className="flex justify-end mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                      {t.status[request.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Information */}
                    <div>
                      <h3 className={`font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {t.propertyInfo}
                      </h3>
                      <div className="space-y-2">
                        <p className="font-medium">{request.propertyTitle}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMapPin />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar />
                          <span>{new Date(request.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiClock />
                          <span>{request.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Renter Information */}
                    <div>
                      <h3 className={`font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {t.renterInfo}
                      </h3>
                      <div className="space-y-2">
                        <p className="font-medium">{request.renterName}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiPhone />
                          <span>{request.renterPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMail />
                          <span>{request.renterEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700"
                      >
                        <FiX />
                        {t.reject}
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700"
                      >
                        <FiCheck />
                        {t.approve}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
} 