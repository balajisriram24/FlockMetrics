import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const KEY = 'subscriptions'

export default function Subscription() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', email: '', plan: 'free', payment_method: 'gpay' })
  const navigate = useNavigate()

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setList(JSON.parse(raw))
  }, [])

  const save = (next) => { setList(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const handleAdd = (e) => {
    e.preventDefault()
    if (form.plan === 'premium') {
      if (!form.payment_method) return alert('Select payment method for premium')
      // Save pending payment and redirect to payment page
      const pending = { ...form, amount: 2000, date: new Date().toISOString().split('T')[0] }
      localStorage.setItem('pending_payment', JSON.stringify(pending))
      navigate('/payment')
      return
    }

    const entry = { ...form, date: new Date().toISOString().split('T')[0] }
    const next = [entry, ...list]
    save(next)
    setForm({ name: '', email: '', plan: 'free', payment_method: 'gpay' })
  }

  return (
    <div className="container">
      <h1>Subscriptions</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3>Subscribe</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="form-group"><label>Plan</label>
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option value="free">Free (Trial)</option>
                <option value="premium">Premium (2000 Rs)</option>
              </select>
            </div>
            <div className="form-group"><label>Payment Method</label>
              <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
                <option value="gpay">GPay</option>
                <option value="phonepay">PhonePe</option>
                <option value="none">None</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>

        <div className="card">
          <h3>Subscribers</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Plan</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map((s, i) => (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.plan}{s.paid ? ' (paid)' : ''}</td>
                    <td>
                      {s.paid && s.receipt ? (
                        <button className="btn btn-secondary" onClick={() => navigate(`/receipt/${s.receipt.txId}`)}>View Receipt</button>
                      ) : s.plan === 'premium' && !s.paid ? (
                        <button className="btn btn-primary" onClick={() => {
                          // if a pending payment exists for this subscriber, go to payment; otherwise create pending and go
                          const pending = localStorage.getItem('pending_payment')
                          if (!pending) {
                            const p = { name: s.name, email: s.email, plan: s.plan, payment_method: s.payment_method || 'gpay', amount: 2000, date: s.date }
                            localStorage.setItem('pending_payment', JSON.stringify(p))
                          }
                          navigate('/payment')
                        }}>Pay</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p style={{ padding: 12 }}>No subscribers yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
