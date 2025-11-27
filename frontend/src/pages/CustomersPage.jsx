import React, { useState, useEffect } from 'react'
import { customerAPI } from '../services/api'
import toast from 'react-hot-toast'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Deutschland',
    notes: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [search])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await customerAPI.getAll({ search, per_page: 50 })
      setCustomers(response.data.data)
    } catch (error) {
      toast.error('Fehler beim Laden der Kunden')
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await customerAPI.update(editingId, formData)
        toast.success('Kunde aktualisiert')
      } else {
        await customerAPI.create(formData)
        toast.success('Kunde erstellt')
      }

      setShowModal(false)
      setEditingId(null)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Deutschland',
        notes: '',
      })
      fetchCustomers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Fehler beim Speichern')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      try {
        await customerAPI.delete(id)
        toast.success('Kunde gelöscht')
        fetchCustomers()
      } catch (error) {
        toast.error('Fehler beim Löschen')
      }
    }
  }

  const handleEdit = (customer) => {
    setFormData(customer)
    setEditingId(customer.id)
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: 'Deutschland',
      notes: '',
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kunden</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Neuer Kunde
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Kunden durchsuchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Wird geladen...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Telefon</th>
                  <th>Stadt</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.first_name} {customer.last_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.city}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:underline"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Kunde bearbeiten' : 'Neuer Kunde'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Vorname</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Nachname</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">E-Mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Stadt</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">PLZ</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">Notizen</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Speichern
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 btn-secondary"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersPage
