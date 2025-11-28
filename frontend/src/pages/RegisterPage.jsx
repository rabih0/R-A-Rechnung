import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.passwordConfirmation) {
      toast.error('كلمات المرور غير متطابقة')
      return
    }

    const success = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.passwordConfirmation
    )

    if (success) {
      toast.success('تم التسجيل بنجاح!')
      navigate('/')
    } else {
      toast.error(error || 'فشل التسجيل')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          تسجيل جديد
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الاسم
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="الاسم الكامل"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
