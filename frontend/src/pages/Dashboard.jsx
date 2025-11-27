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
      toast.error('Fehler beim Laden der Statistiken')
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }



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
        />
        <StatCard
          label="Verträge"
          value={stats.total_contracts}
          icon="📄"
        />
        <StatCard
          label="Rechnungen"
          value={stats.total_invoices}
          icon="💰"
        />
        <StatCard
          label="Ausstehende Rechnungen"
          value={stats.pending_invoices}
          icon="⏰"
          trend="up"
          trendText="Zu beachten"
        />
        <StatCard
          label="Kommende Termine"
          value={stats.upcoming_appointments}
          icon="📅"
        />
        <StatCard
          label="Abgeschlossene Verträge"
          value={stats.completed_contracts}
          icon="✅"
          trend="up"
          trendText="Gut"
        />
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Willkommen im Umzugsmanagement System 👋
        </h2>
        <p className="text-gray-600 mb-6">
          Verwalten Sie Ihre Umzüge, Kunden, Verträge und Rechnungen effizient
          mit diesem integrierten System.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Schnelle Navigation</h3>
            <p className="text-sm text-blue-700">
              Nutzen Sie das Seitenmenü zum Zugriff auf alle wichtigen Module und Funktionen.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">⚙️ Einstellungen</h3>
            <p className="text-sm text-green-700">
              Passen Sie Preise, Gebühren und Unternehmensdetails flexibel an.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">📊 Echtzeitdaten</h3>
            <p className="text-sm text-purple-700">
              Alle Informationen werden live aktualisiert und sind jederzeit verfügbar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
