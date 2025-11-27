import React, { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'
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
      toast.error('Fehler beim Laden der Statistiken')
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500',
      yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500',
      red: 'bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500',
      indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500',
    }
    return colors[color] || colors.blue
  }

  const StatCard = ({ label, value, icon, color }) => (
    <div className={`card ${getColorClasses(color)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Wird geladen...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Gesamtkunden"
          value={stats.total_customers}
          icon="👥"
          color="blue"
        />
        <StatCard
          label="Verträge"
          value={stats.total_contracts}
          icon="📄"
          color="green"
        />
        <StatCard
          label="Rechnungen"
          value={stats.total_invoices}
          icon="💰"
          color="yellow"
        />
        <StatCard
          label="Ausstehende Rechnungen"
          value={stats.pending_invoices}
          icon="⏰"
          color="red"
        />
        <StatCard
          label="Kommende Termine"
          value={stats.upcoming_appointments}
          icon="📅"
          color="purple"
        />
        <StatCard
          label="Abgeschlossene Verträge"
          value={stats.completed_contracts}
          icon="✅"
          color="indigo"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Willkommen im Umzugsmanagement System
        </h2>
        <p className="text-gray-600 mb-4">
          Verwalten Sie Ihre Umzüge, Kunden, Verträge und Rechnungen effizient
          mit diesem integrierten System.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Schnelle Navigation</h3>
            <p className="text-sm text-blue-700">
              Nutzen Sie das Seitenmenü, um auf Kunden, Verträge, Rechnungen und
              Termine zuzugreifen.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">⚙️ Einstellungen</h3>
            <p className="text-sm text-green-700">
              Passen Sie Preisebenen, Gebühren und Unternehmensdetails in den
              Einstellungen an.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
