/**
 * Sales Management - Add and list sales
 */
import { useState, useEffect } from 'react'
import { getSales, addSale } from '../api'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ description: '', amount: '', quantity: 1 })

  const loadSales = () => {
    getSales()
      .then(setSales)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadSales, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await addSale({
        description: form.description || 'Sale',
        amount: parseFloat(form.amount) || 0,
        quantity: parseInt(form.quantity) || 1,
        date: new Date().toISOString().split('T')[0]
      })
      setSuccess('Sale recorded!')
      setForm({ description: '', amount: '', quantity: 1 })
      loadSales()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Sales Management</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Add Sale</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Egg sales"
              />
            </div>
            <div className="form-group">
              <label>Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Sale</button>
          </form>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Sales History</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s._id}>
                      <td>{s.date}</td>
                      <td>{s.description}</td>
                      <td>{s.quantity}</td>
                      <td>${s.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sales.length === 0 && <p style={{ padding: 20 }}>No sales yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
