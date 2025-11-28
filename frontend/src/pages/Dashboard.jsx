import React, { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'
import StatCard from '../components/StatCard'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_contracts: 0,
    total_invoices: 0,
    pending_invoices: 0,
    upcoming_appointments: 0,
    completed_contracts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await settingsAPI.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      toast.error('خطأ في تحميل الإحصائيات')
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        لوحة التحكم
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="إجمالي العملاء"
          value={stats.total_customers}
          icon="👥"
        />
        <StatCard
          label="العقود"
          value={stats.total_contracts}
          icon="📄"
        />
        <StatCard
          label="الفواتير"
          value={stats.total_invoices}
          icon="💰"
        />
        <StatCard
          label="الفواتير المعلقة"
          value={stats.pending_invoices}
          icon="⏰"
          trend="up"
          trendText="للمتابعة"
        />
        <StatCard
          label="المواعيد القادمة"
          value={stats.upcoming_appointments}
          icon="📅"
        />
        <StatCard
          label="العقود المكتملة"
          value={stats.completed_contracts}
          icon="✅"
          trend="up"
          trendText="جيد"
        />
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          مرحباً بك في نظام إدارة النقل 👋
        </h2>
        <p className="text-gray-600 mb-6">
          قم بإدارة عمليات النقل والعملاء والعقود والفواتير بكفاءة
          مع هذا النظام المتكامل.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 تنقل سريع</h3>
            <p className="text-sm text-blue-700">
              استخدم القائمة الجانبية للوصول إلى جميع الوحدات والوظائف المهمة.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">⚙️ الإعدادات</h3>
            <p className="text-sm text-green-700">
              قم بتخصيص الأسعار والرسوم وتفاصيل الشركة بمرونة.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">📊 بيانات فورية</h3>
            <p className="text-sm text-purple-700">
              يتم تحديث جميع المعلومات بشكل مباشر ومتاحة في أي وقت.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
