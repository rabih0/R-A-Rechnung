import React, { useState, useEffect } from 'react'
import { contractAPI, customerAPI } from '../services/api'
import toast from 'react-hot-toast'

const ContractsPage = () => {
  const [contracts, setContracts] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [priceCalculation, setPriceCalculation] = useState(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    contract_date: new Date().toISOString().split('T')[0],
    from_address: '',
    to_address: '',
    distance_km: '',
    from_floors: '',
    to_floors: '',
    price_level: 'medium',
    items: [],
    notes: '',
  })

  useEffect(() => {
    fetchContracts()
    fetchCustomers()
  }, [])

  const fetchContracts = async () => {
    try {
      setIsLoading(true)
      const response = await contractAPI.getAll({ per_page: 50 })
      setContracts(response.data.data)
    } catch (error) {
      toast.error('Fehler beim Laden der Verträge')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll({ per_page: 500 })
      setCustomers(response.data.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await contractAPI.create(formData)
      toast.success('Vertrag erstellt')
      setShowModal(false)
      setFormData({
        customer_id: '',
        contract_date: new Date().toISOString().split('T')[0],
        from_address: '',
        to_address: '',
        distance_km: '',
        from_floors: '',
        to_floors: '',
        price_level: 'medium',
        items: [],
        notes: '',
      })
      fetchContracts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Fehler beim Erstellen')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Vertrag wirklich löschen?')) {
      try {
        await contractAPI.delete(id)
        toast.success('Vertrag gelöscht')
        fetchContracts()
      } catch (error) {
        toast.error('Fehler beim Löschen')
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return statusClasses[status] || statusClasses.draft
  }

  const calculatePrice = async () => {
    if (!formData.customer_id) {
      toast.error('Bitte wählen Sie einen Kunden aus')
      return
    }

    try {
      const response = await contractAPI.calculatePrice({
        items: formData.items,
        distance_km: parseFloat(formData.distance_km) || 0,
        from_floors: parseInt(formData.from_floors) || 0,
        to_floors: parseInt(formData.to_floors) || 0,
        price_level: formData.price_level,
      })

      setPriceCalculation(response.data)
    } catch (error) {
      toast.error('Fehler bei Preisberechnung')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Verträge</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Neuer Vertrag
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Wird geladen...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Vertragsnummer</th>
                  <th>Kunde</th>
                  <th>Von - Nach</th>
                  <th>Gesamtpreis</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td>{contract.contract_number}</td>
                    <td>{contract.customer?.first_name} {contract.customer?.last_name}</td>
                    <td>{contract.from_address} → {contract.to_address}</td>
                    <td>€{contract.total_price?.toFixed(2) || '0.00'}</td>
                    <td><span className={`badge px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeClass(contract.status)}`}>{contract.status}</span></td>
                    <td>
                      <button className="text-blue-600 hover:underline mr-4">Ansicht</button>
                      <button
                        onClick={() => handleDelete(contract.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-bold mb-6">Neuer Vertrag</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Kunde</label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Wählen Sie einen Kunden</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Vertragsdatum</label>
                  <input
                    type="date"
                    name="contract_date"
                    value={formData.contract_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Von Adresse</label>
                  <input
                    type="text"
                    name="from_address"
                    value={formData.from_address}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Nach Adresse</label>
                  <input
                    type="text"
                    name="to_address"
                    value={formData.to_address}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Entfernung (km)</label>
                  <input
                    type="number"
                    name="distance_km"
                    value={formData.distance_km}
                    onChange={handleChange}
                    className="form-input"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Von Etagen</label>
                  <input
                    type="number"
                    name="from_floors"
                    value={formData.from_floors}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Bis Etagen</label>
                  <input
                    type="number"
                    name="to_floors"
                    value={formData.to_floors}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Preisebene</label>
                <select
                  name="price_level"
                  value={formData.price_level}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="medium">Mittel</option>
                  <option value="above">Über Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>

              <button
                type="button"
                onClick={calculatePrice}
                className="mb-4 btn-secondary"
              >
                Preis berechnen
              </button>

              {priceCalculation && (
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <h3 className="font-bold mb-2">Preisberechnung:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>Grundpreis: €{priceCalculation.base_price?.toFixed(2)}</p>
                    <p>Fahrtkosten: €{priceCalculation.distance_price?.toFixed(2)}</p>
                    <p>Etagekosten: €{priceCalculation.floor_price?.toFixed(2)}</p>
                    <p>Zwischensumme: €{priceCalculation.subtotal?.toFixed(2)}</p>
                    <p>Steuern (19%): €{priceCalculation.tax?.toFixed(2)}</p>
                    <p className="font-bold">Gesamtbetrag: €{priceCalculation.total?.toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Vertrag erstellen
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default ContractsPage
