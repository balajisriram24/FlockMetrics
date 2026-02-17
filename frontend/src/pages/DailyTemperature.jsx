import { useState, useEffect } from 'react'

function storageKey() { return 'daily_temperature_records' }

export default function DailyTemperature() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ date: '', minTemp: '', maxTemp: '', avgTemp: '', notes: '' })

  useEffect(() => {
    const raw = localStorage.getItem(storageKey())
    if (raw) setRecords(JSON.parse(raw))
  }, [])

  const save = (next) => {
    setRecords(next)
    localStorage.setItem(storageKey(), JSON.stringify(next))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const entry = { ...form, date: form.date || new Date().toISOString().split('T')[0] }
    const next = [entry, ...records]
    save(next)
    setForm({ date: '', minTemp: '', maxTemp: '', avgTemp: '', notes: '' })
  }

  return (
    <div className="container">
      <h1>Daily Temperature Record</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3>Add Temperature</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Min Temp (°C)</label>
              <input type="number" step="0.1" value={form.minTemp} onChange={(e) => setForm({ ...form, minTemp: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Max Temp (°C)</label>
              <input type="number" step="0.1" value={form.maxTemp} onChange={(e) => setForm({ ...form, maxTemp: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Average Temp (°C)</label>
              <input type="number" step="0.1" value={form.avgTemp} onChange={(e) => setForm({ ...form, avgTemp: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="optional" />
            </div>
            <button className="btn btn-primary" type="submit">Add</button>
          </form>
        </div>

        <div className="card">
          <h3>Recent Temperatures</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Date</th><th>Min</th><th>Max</th><th>Avg</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i}><td>{r.date}</td><td>{r.minTemp}</td><td>{r.maxTemp}</td><td>{r.avgTemp}</td><td>{r.notes}</td></tr>
                ))}
              </tbody>
            </table>
            {records.length === 0 && <p style={{ padding: 12 }}>No records yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
