import React, { useState, useEffect } from 'react'
import { appointmentAPI, customerAPI } from '../services/api'
import toast from 'react-hot-toast'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    appointment_date: '',
    end_date: '',
    location: '',
    notify: true,
  })

  useEffect(() => {
    fetchAppointments()
    fetchCustomers()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await appointmentAPI.getAll({ per_page: 100 })
      setAppointments(response.data.data)
    } catch (error) {
      toast.error('Fehler beim Laden der Termine')
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
      await appointmentAPI.create({
        ...formData,
        appointment_date: `${formData.appointment_date} 09:00:00`,
        end_date: `${formData.end_date} 17:00:00`,
      })
      toast.success('Termin erstellt')
      setShowModal(false)
      setFormData({
        customer_id: '',
        title: '',
        description: '',
        appointment_date: '',
        end_date: '',
        location: '',
        notify: true,
      })
      fetchAppointments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Fehler beim Erstellen')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Termin wirklich löschen?')) {
      try {
        await appointmentAPI.delete(id)
        toast.success('Termin gelöscht')
        fetchAppointments()
      } catch (error) {
        toast.error('Fehler beim Löschen')
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    setFormData((prev) => ({
      ...prev,
      appointment_date: dateStr,
      end_date: dateStr,
    }))
    setSelectedDate(date)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'blue'
      case 'in_progress':
        return 'yellow'
      case 'completed':
        return 'green'
      case 'cancelled':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Termine</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Neuer Termin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-center py-8">Wird geladen...</div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Kommende Termine</h2>
              <div className="space-y-4">
                {appointments
                  .filter((apt) => apt.status !== 'cancelled')
                  .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
                  .slice(0, 10)
                  .map((appointment) => (
                    <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{appointment.title}</h3>
                          <p className="text-sm text-gray-600">
                            {appointment.customer?.first_name} {appointment.customer?.last_name}
                          </p>
                        </div>
                        <span className={`badge badge-${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(appointment.appointment_date).toLocaleDateString('de-DE')}
                        {appointment.location && ` 📍 ${appointment.location}`}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button className="text-blue-600 hover:underline text-sm">Bearbeiten</button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Kalender</h2>
          <Calendar
            value={selectedDate}
            onChange={handleDateSelect}
            className="react-calendar"
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md my-8">
            <h2 className="text-2xl font-bold mb-6">Neuer Termin</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Titel</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="z. B. Umzug durchführen"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Beschreibung</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Startdatum</label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Enddatum</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Ort</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="z. B. Berlin"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notify"
                    checked={formData.notify}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Benachrichtigung senden</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Termin erstellen
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

export default AppointmentsPage
