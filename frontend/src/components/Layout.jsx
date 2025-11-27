import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Kunden', path: '/customers', icon: '👥' },
    { label: 'Verträge', path: '/contracts', icon: '📄' },
    { label: 'Rechnungen', path: '/invoices', icon: '💰' },
    { label: 'Termine', path: '/appointments', icon: '📅' },
    { label: 'Einstellungen', path: '/settings', icon: '⚙️' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
            Umzugs
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-800 p-2 rounded"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 transition ${
                isActive(item.path)
                  ? 'bg-blue-600 border-l-4 border-blue-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Umzugsmanagement System
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                <FiLogOut /> Abmelden
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
