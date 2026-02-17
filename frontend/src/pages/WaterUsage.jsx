import { useState, useEffect } from 'react'

const KEY = 'water_usage_records'

export default function WaterUsage() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ date: '', liters: '' })
  const [showReminder, setShowReminder] = useState(false)
  const [lastReminderTime, setLastReminderTime] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setRecords(JSON.parse(raw))
    
    // Load last reminder time from localStorage
    const savedTime = localStorage.getItem('water_reminder_time')
    if (savedTime) setLastReminderTime(parseInt(savedTime))
  }, [])

  // Set up 1-hour reminder
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const last = lastReminderTime || now
      const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
      
      if (now - last >= oneHour) {
        setShowReminder(true)
        setLastReminderTime(now)
        localStorage.setItem('water_reminder_time', now.toString())
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [lastReminderTime])

  const save = (next) => { setRecords(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const handleAdd = (e) => {
    e.preventDefault()
    const entry = { ...form, date: form.date || new Date().toISOString().split('T')[0] }
    const next = [entry, ...records]
    save(next)
    setForm({ date: '', liters: '' })
  }

  return (
    <div className="container">
      <h1>Water Usage</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3>Record Usage</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label>Liters</label><input type="number" step="0.1" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} /></div>
            <button className="btn btn-primary" type="submit">Add</button>
          </form>
        </div>

        <div className="card">
          <h3>Usage History</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Liters</th></tr></thead>
              <tbody>
                {records.map((r, i) => (<tr key={i}><td>{r.date}</td><td>{r.liters}</td></tr>))}
              </tbody>
            </table>
            {records.length === 0 && <p style={{ padding: 12 }}>No water usage recorded yet.</p>}
          </div>
        </div>
      </div>

      {/* Water Reminder Modal */}
      {showReminder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'hsl(0, 0%, 100%)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: 400, textAlign: 'center' }}>
            <h3 style={{ color: '#2196F3', marginBottom: 16 }}>💧 Water Usage Reminder</h3>
            <p style={{ fontSize: 16, marginBottom: 24 }}>Time to record water usage!</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  document.querySelector('input[type="date"]')?.focus()
                  setShowReminder(false)
                }}
                style={{ flex: 1 }}
              >
                Record Now
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowReminder(false)}
                style={{ flex: 1 }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
