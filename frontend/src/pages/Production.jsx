import { useState, useEffect, useMemo } from 'react'

const KEY = 'production_records'

export default function Production() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ date: '', quantity: '' })

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setRecords(JSON.parse(raw))
  }, [])

  const save = (next) => { setRecords(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const handleAdd = (e) => {
    e.preventDefault()
    const entry = { ...form, date: form.date || new Date().toISOString().split('T')[0] }
    const next = [entry, ...records]
    save(next)
    setForm({ date: '', quantity: '' })
  }

  const weeklySummary = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 6)
    const total = records.reduce((acc, r) => {
      const d = new Date(r.date)
      if (d >= sevenDaysAgo && d <= now) return acc + (parseFloat(r.quantity) || 0)
      return acc
    }, 0)
    return { last7days: total }
  }, [records])

  return (
    <div className="container">
      <h1>Production (Daily / Weekly)</h1>
      <div style={{ marginBottom: 12 }}>
        <strong>Last 7 days total:</strong> {weeklySummary.last7days}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3>Record Production</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label>Quantity</label><input type="number" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
            <button className="btn btn-primary" type="submit">Add</button>
          </form>
        </div>

        <div className="card">
          <h3>Production History</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Quantity</th></tr></thead>
              <tbody>
                {records.map((r, i) => (<tr key={i}><td>{r.date}</td><td>{r.quantity}</td></tr>))}
              </tbody>
            </table>
            {records.length === 0 && <p style={{ padding: 12 }}>No production records yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
