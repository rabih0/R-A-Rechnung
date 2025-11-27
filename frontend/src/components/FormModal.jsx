import React from 'react'
import { FiX } from 'react-icons/fi'

const FormModal = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitButtonText = 'Speichern',
  cancelButtonText = 'Abbrechen',
  isLoading = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX size={24} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          {children}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird gespeichert...' : submitButtonText}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 btn-secondary disabled:opacity-50"
            >
              {cancelButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormModal
