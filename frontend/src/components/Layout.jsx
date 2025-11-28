import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FiMenu, FiX, FiLogOut, FiChevronDown } from 'react-icons/fi'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const menuItems = [
    { label: 'لوحة التحكم', path: '/', icon: '📊' },
    { label: 'العملاء', path: '/customers', icon: '👥' },
    { label: 'العقود', path: '/contracts', icon: '📄' },
    { label: 'الفواتير', path: '/invoices', icon: '💰' },
    { label: 'المواعيد', path: '/appointments', icon: '📅' },
    { label: 'الإعدادات', path: '/settings', icon: '⚙️' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-y-auto shadow-lg`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold">
              ن
            </div>
            <h1 className="font-bold text-lg">نقل</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-700 p-2 rounded transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 transition duration-200 ${isActive(item.path)
                  ? 'bg-blue-600 border-r-4 border-blue-300 text-white'
                  : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="mr-3 text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900 ${!sidebarOpen && 'p-2'}`}>
          <div className={`text-xs text-gray-400 ${!sidebarOpen && 'hidden'}`}>
            الإصدار 1.0.0
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FiMenu size={20} />
              </button>
            </div>
            <h2 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              نظام إدارة النقل
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gray-900 text-white overflow-y-auto">
            <div className="p-4">
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded transition ${isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="mr-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
