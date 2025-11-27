import React, { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('pricing')
  const [isLoading, setIsLoading] = useState(true)
  const [pricingData, setPricingData] = useState({
    grundpreis: 50,
    preisProKm: 1.2,
    preisProEtage: 8,
    stundenlohn: 25,
    preisniveau: 'medium',
    prozentAufschlag: 0,
  })
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_city: '',
    company_postal_code: '',
    company_tax_id: '',
    vat_rate: 19,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const [pricingResponse, companyResponse] = await Promise.all([
        settingsAPI.getPricingSettings(),
        settingsAPI.getCompanySettings(),
      ])

      if (pricingResponse.data && Object.keys(pricingResponse.data).length > 0) {
        setPricingData(pricingResponse.data)
      }

      if (companyResponse.data && Object.keys(companyResponse.data).length > 0) {
        setCompanyData(companyResponse.data)
      }
    } catch (error) {
      toast.error('Fehler beim Laden der Einstellungen')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePricingChange = (e) => {
    const { name, value } = e.target
    setPricingData((prev) => ({
      ...prev,
      [name]: name === 'preisniveau' ? value : parseFloat(value),
    }))
  }

  const handleCompanyChange = (e) => {
    const { name, value } = e.target
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const savePricingSettings = async () => {
    try {
      await settingsAPI.updatePricingSettings(pricingData)
      toast.success('Preiseinstellungen gespeichert')
    } catch (error) {
      toast.error('Fehler beim Speichern der Preiseinstellungen')
    }
  }

  const saveCompanySettings = async () => {
    try {
      await settingsAPI.updateCompanySettings(companyData)
      toast.success('Unternehmenseinstellungen gespeichert')
    } catch (error) {
      toast.error('Fehler beim Speichern der Unternehmenseinstellungen')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Wird geladen...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Einstellungen</h1>

      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'pricing'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          💰 Preiseinstellungen
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'company'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🏢 Unternehmenseinstellungen
        </button>
      </div>

      {activeTab === 'pricing' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Preiseinstellungen</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2">Grundpreis (€)</label>
              <input
                type="number"
                name="grundpreis"
                value={pricingData.grundpreis}
                onChange={handlePricingChange}
                className="form-input"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Basisbetrag pro Umzug</p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Preis pro Kilometer (€)</label>
              <input
                type="number"
                name="preisProKm"
                value={pricingData.preisProKm}
                onChange={handlePricingChange}
                className="form-input"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Preis pro Etage (€)</label>
              <input
                type="number"
                name="preisProEtage"
                value={pricingData.preisProEtage}
                onChange={handlePricingChange}
                className="form-input"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Stundenlohn (€)</label>
              <input
                type="number"
                name="stundenlohn"
                value={pricingData.stundenlohn}
                onChange={handlePricingChange}
                className="form-input"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Standardpreisebene</label>
              <select
                name="preisniveau"
                value={pricingData.preisniveau}
                onChange={handlePricingChange}
                className="form-select"
              >
                <option value="medium">Mittel</option>
                <option value="above">Über Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Aufschlag (%)</label>
              <input
                type="number"
                name="prozentAufschlag"
                value={pricingData.prozentAufschlag}
                onChange={handlePricingChange}
                className="form-input"
                step="0.01"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">Zusätzlicher Prozentsatz auf alle Preise</p>
            </div>
          </div>

          <button
            onClick={savePricingSettings}
            className="btn-primary"
          >
            Speichern
          </button>
        </div>
      )}

      {activeTab === 'company' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Unternehmenseinstellungen</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2">Unternehmensname</label>
              <input
                type="text"
                name="company_name"
                value={companyData.company_name}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">E-Mail</label>
              <input
                type="email"
                name="company_email"
                value={companyData.company_email}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Telefon</label>
              <input
                type="tel"
                name="company_phone"
                value={companyData.company_phone}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Steuernummer</label>
              <input
                type="text"
                name="company_tax_id"
                value={companyData.company_tax_id}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Adresse</label>
              <input
                type="text"
                name="company_address"
                value={companyData.company_address}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Stadt</label>
              <input
                type="text"
                name="company_city"
                value={companyData.company_city}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">PLZ</label>
              <input
                type="text"
                name="company_postal_code"
                value={companyData.company_postal_code}
                onChange={handleCompanyChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">MwSt-Satz (%)</label>
              <input
                type="number"
                name="vat_rate"
                value={companyData.vat_rate}
                onChange={handleCompanyChange}
                className="form-input"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          <button
            onClick={saveCompanySettings}
            className="btn-primary"
          >
            Speichern
          </button>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
