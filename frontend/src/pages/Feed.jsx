import { useState, useEffect } from 'react'

const KEY = 'feed_records'

// Feed type database
const FEED_TYPES = [
  'Grower mash',
  'Layer mash',
  'Broiler mash',
  'Chick starter',
  'Pullet grower',
  'Calcium supplement',
  'Protein supplement',
  'Vitamin premix',
]

export default function Feed() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ date: '', type: '', quantity: '', cost: '' })
  const [customFeedType, setCustomFeedType] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setRecords(JSON.parse(raw))
  }, [])

  const save = (next) => { setRecords(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const handleAdd = (e) => {
    e.preventDefault()
    const finalType = form.type === '__custom' ? customFeedType.trim() : form.type
    if (!finalType) return // Prevent saving without a feed type
    const entry = { ...form, type: finalType, date: form.date || new Date().toISOString().split('T')[0] }
    const next = [entry, ...records]
    save(next)
    setForm({ date: '', type: '', quantity: '', cost: '' })
    setCustomFeedType('')
  }

  return (
    <div className="container">
      <h1>Feed Records</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3>Add Feed</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group">
              <label>Feed Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="">-- Select feed type --</option>
                {FEED_TYPES.map((ft, i) => (<option key={i} value={ft}>{ft}</option>))}
                <option value="__custom">Other</option>
              </select>
              {form.type === '__custom' && (
                <input
                  type="text"
                  placeholder="Enter custom feed type"
                  value={customFeedType}
                  onChange={(e) => setCustomFeedType(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
            <div className="form-group"><label>Quantity (kg)</label><input type="number" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
            <div className="form-group"><label>Cost ($)</label><input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
            <button className="btn btn-primary" type="submit">Add Feed</button>
          </form>
        </div>

        <div className="card">
          <h3>Feed History</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Type</th><th>Qty (kg)</th><th>Cost</th></tr></thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i}><td>{r.date}</td><td>{r.type}</td><td>{r.quantity}</td><td>{r.cost}</td></tr>
                ))}
              </tbody>
            </table>
            {records.length === 0 && <p style={{ padding: 12 }}>No feed records yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
