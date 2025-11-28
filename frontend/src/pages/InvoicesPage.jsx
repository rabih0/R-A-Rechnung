import React, { useState, useEffect } from 'react'
import { invoiceAPI, customerAPI } from '../services/api'
import toast from 'react-hot-toast'

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unit_price: 0 }],
    notes: '',
  })

  useEffect(() => {
    fetchInvoices()
    fetchCustomers()
  }, [])

  const fetchInvoices = async () => {
    try {
      setIsLoading(true)
      const response = await invoiceAPI.getAll({ per_page: 50 })
      setInvoices(response.data.data)
    } catch (error) {
      toast.error('خطأ في تحميل الفواتير')
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
      await invoiceAPI.create(formData)
      toast.success('تم إنشاء الفاتورة')
      setShowModal(false)
      setFormData({
        customer_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0 }],
        notes: '',
      })
      fetchInvoices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في الإنشاء')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة؟')) {
      try {
        await invoiceAPI.delete(id)
        toast.success('تم حذف الفاتورة')
        fetchInvoices()
      } catch (error) {
        toast.error('خطأ في الحذف')
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

  const handleItemChange = (index, field, value) => {
    const items = [...formData.items]
    items[index][field] = value
    setFormData((prev) => ({
      ...prev,
      items,
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }],
    }))
  }

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const calculateTotal = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0),
      0
    )
    const tax = subtotal * 0.19
    return { subtotal, tax, total: subtotal + tax }
  }

  const totals = calculateTotal()

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return statusClasses[status] || statusClasses.draft
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">الفواتير</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + فاتورة جديدة
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>العميل</th>
                  <th>المبلغ الإجمالي</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.customer?.first_name} {invoice.customer?.last_name}</td>
                    <td>€{invoice.total?.toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadgeClass(invoice.status)}`}>{invoice.status}</span></td>
                    <td>
                      <button className="text-blue-600 hover:underline mr-4">عرض</button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="text-red-600 hover:underline"
                      >
                        حذف
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
            <h2 className="text-2xl font-bold mb-6">فاتورة جديدة</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">العميل</label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">اختر عميلاً</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4">بنود الفاتورة</h3>

              <div className="space-y-2 mb-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="الوصف"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="form-input"
                      required
                    />
                    <input
                      type="number"
                      placeholder="الكمية"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="form-input"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="السعر"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      className="form-input"
                      step="0.01"
                      min="0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:underline"
                    >
                      إزالة
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="mb-4 btn-secondary"
              >
                + إضافة بند
              </button>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="flex justify-between mb-2">
                  <span>المجموع الفرعي:</span>
                  <span>€{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>الضرائب (19%):</span>
                  <span>€{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>المبلغ الإجمالي:</span>
                  <span>€{totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  إنشاء الفاتورة
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoicesPage
